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

        $data = $bulkRequest->toArray();
        $data['image_thumbnails'] = $bulkRequest->imageThumbnails;
        unset($data['imageThumbnails']);

        return response()->json([
            'bulk_request' => $data,
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

        // Always load all imageThumbnails for each bulk request
        $query = $user->bulkRequests()
            ->with('imageThumbnails')
            ->latest();

        $bulkRequests = $query->get();



        // Apply status filtering on the frontend instead of in the relationship
        if ($status && $status !== 'all') {
            $bulkRequests = $bulkRequests->map(function ($bulkRequest) use ($status) {
                $filteredThumbnails = $bulkRequest->imageThumbnails->filter(function ($thumbnail) use ($status) {
                    return $thumbnail->status === $status;
                });

                // Create a new collection with filtered thumbnails
                $bulkRequest->setRelation('imageThumbnails', $filteredThumbnails);

                return $bulkRequest;
            });
        }

        // Transform the data to use image_thumbnails instead of imageThumbnails
        $transformedBulkRequests = $bulkRequests->map(function ($bulkRequest) {
            $data = $bulkRequest->toArray();
            $data['image_thumbnails'] = $bulkRequest->imageThumbnails;
            unset($data['imageThumbnails']);
            return $data;
        });

        return response()->json(['bulk_requests' => $transformedBulkRequests]);
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



        foreach ($bulkRequest->imageThumbnails as $index => $imageThumbnail) {
            // Priority-based delay: higher priority users get faster processing
            $baseDelay = rand(1, 10); // Base delay 1-10 seconds
            $priorityDelay = max(0, $baseDelay - ($priority - 1) * 2); // Priority reduces delay

            // Create job with priority (queue is automatically assigned)
            $job = ProcessThumbnailJob::dispatch($imageThumbnail, $priority)
                ->delay(now()->addSeconds($priorityDelay));

            // Set job priority for queue processing
            if (method_exists($job, 'priority')) {
                $job->priority($priority);
            }


        }
    }

    /**
     * Get queue status for priority-based processing
     */
    public function queueStatus()
    {
        $user = Auth::user();

        $queues = ['enterprise', 'pro', 'free'];
        $queueStatus = [];

        foreach ($queues as $queue) {
            $pendingJobs = DB::table('jobs')->where('queue', $queue)->count();
            $failedJobs = DB::table('failed_jobs')->where('queue', $queue)->count();

            $queueStatus[$queue] = [
                'pending' => $pendingJobs,
                'failed' => $failedJobs,
                'active' => $pendingJobs > 0,
                'priority' => $this->getQueuePriority($queue)
            ];
        }

        return response()->json([
            'queues' => $queueStatus,
            'user_priority' => $user->getPriorityMultiplier(),
            'user_tier' => $user->subscription_tier,
            'total_pending' => DB::table('jobs')->count(),
            'total_failed' => DB::table('failed_jobs')->count()
        ]);
    }

    /**
     * Get priority level for queue
     */
    private function getQueuePriority(string $queue): int
    {
        return match($queue) {
            'enterprise' => 3,
            'pro' => 2,
            'free' => 1,
            default => 1
        };
    }

    /**
     * Get queue name based on priority level
     */
    private function getQueueNameByPriority(int $priority): string
    {
        return match($priority) {
            3 => 'enterprise',
            2 => 'pro',
            1 => 'free',
            default => 'free',
        };
    }
}
