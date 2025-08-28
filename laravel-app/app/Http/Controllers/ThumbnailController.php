<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessThumbnailJob;
use App\Models\BulkRequest;
use App\Models\ImageThumbnail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ThumbnailController extends Controller
{
    /**
     * Store a new bulk thumbnail request
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'image_urls' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imageUrls = array_filter(explode("\n", $request->image_urls));
        $totalImages = count($imageUrls);

        // Check per-request limit (not total quota)
        if ($totalImages > $user->quota_limit) {
            return response()->json([
                'error' => "Request limit exceeded. You can process up to {$user->quota_limit} images per request. You're trying to add {$totalImages} images."
            ], 403);
        }

        try {
            DB::beginTransaction();

            // Create bulk request
            $bulkRequest = BulkRequest::create([
                'user_id' => $user->id,
                'image_urls' => $request->image_urls,
                'total_images' => $totalImages,
                'priority' => $user->getPriorityMultiplier(),
                'status' => 'pending',
            ]);

            // Create individual image thumbnail records
            foreach ($imageUrls as $imageUrl) {
                $imageUrl = trim($imageUrl);
                if (!empty($imageUrl)) {
                    ImageThumbnail::create([
                        'bulk_request_id' => $bulkRequest->id,
                        'image_url' => $imageUrl,
                        'status' => 'pending',
                    ]);
                }
            }

            // Don't update user quota - it's per-request, not total
            // $user->increment('quota_used', $totalImages);

            DB::commit();

            // Dispatch jobs for processing
            $this->dispatchThumbnailJobs($bulkRequest);

            return response()->json([
                'success' => true,
                'message' => "Bulk request created successfully. Processing {$totalImages} images.",
                'bulk_request_id' => $bulkRequest->id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create bulk request: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get processing status updates
     */
    public function status($bulkRequestId)
    {
        $user = Auth::user();

        $bulkRequest = $user->bulkRequests()->with('imageThumbnails')->find($bulkRequestId);

        if (!$bulkRequest) {
            return response()->json(['error' => 'Bulk request not found'], 404);
        }

        return response()->json([
            'bulk_request' => $bulkRequest,
            'image_thumbnails' => $bulkRequest->imageThumbnails
        ]);
    }

    /**
     * Get filtered results
     */
    public function results(Request $request)
    {
        $user = Auth::user();

        $status = $request->get('status');

        $query = $user->bulkRequests()
            ->with(['imageThumbnails' => function ($query) use ($status) {
                if ($status) {
                    $query->where('status', $status);
                }
            }])
            ->latest();

        $bulkRequests = $query->get();

        return response()->json(['bulk_requests' => $bulkRequests]);
    }

    /**
     * Display the main page with form and results
     */
    public function index()
    {
        $user = Auth::user();
        $bulkRequests = $user->bulkRequests()->with('imageThumbnails')->latest()->get();

        return Inertia::render('Dashboard', [
            'bulkRequests' => $bulkRequests
        ]);
    }

    /**
     * Dispatch thumbnail processing jobs with priority-based processing
     */
    private function dispatchThumbnailJobs(BulkRequest $bulkRequest): void
    {
        $priority = $bulkRequest->priority;
        
        // Log priority information
        \Log::info('Dispatching thumbnail jobs', [
            'bulk_request_id' => $bulkRequest->id,
            'user_id' => $bulkRequest->user_id,
            'priority' => $priority,
            'total_images' => $bulkRequest->total_images,
            'user_tier' => $bulkRequest->user->subscription_tier ?? 'unknown'
        ]);

        foreach ($bulkRequest->imageThumbnails as $index => $imageThumbnail) {
            // Priority-based delay: higher priority users get faster processing
            $baseDelay = rand(1, 10); // Base delay 1-10 seconds
            $priorityDelay = max(0, $baseDelay - ($priority - 1) * 2); // Priority reduces delay
            
            // Create job with priority
            $job = ProcessThumbnailJob::dispatch($imageThumbnail, $priority)
                ->onQueue('thumbnails')
                ->delay(now()->addSeconds($priorityDelay));
            
            // Set job priority for queue processing
            if (method_exists($job, 'priority')) {
                $job->priority($priority);
            }
            
            // Log job dispatch
            \Log::info('Job dispatched', [
                'image_thumbnail_id' => $imageThumbnail->id,
                'priority' => $priority,
                'delay' => $priorityDelay,
                'queue' => 'thumbnails'
            ]);
        }
    }
}
