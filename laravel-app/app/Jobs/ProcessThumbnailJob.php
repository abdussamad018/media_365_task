<?php

namespace App\Jobs;

use App\Models\ImageThumbnail;
use App\Notifications\ThumbnailReadyNotification;
use App\Notifications\BulkRequestCompletedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessThumbnailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 300; // 5 minutes
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public ImageThumbnail $imageThumbnail,
        public int $priority = 1
    ) {
        $this->onQueue('thumbnails');
        $this->priority = $priority;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Update status to processing
            $this->imageThumbnail->update(['status' => 'processing']);

            // Simulate Node.js service processing
            $this->simulateNodeServiceProcessing();

            // Simulate success/failure (80% success rate)
            if (rand(1, 100) <= 80) {
                $this->imageThumbnail->update([
                    'status' => 'processed',
                    'thumbnail_path' => '/thumbnails/' . uniqid() . '.jpg',
                    'processed_at' => now(),
                ]);
            } else {
                $this->imageThumbnail->update([
                    'status' => 'failed',
                    'error_message' => 'Simulated processing failure',
                    'processed_at' => now(),
                ]);
            }

            // Send notification to user about thumbnail completion
            $this->sendThumbnailNotification();

            // Update bulk request counters
            $this->updateBulkRequestCounters();

        } catch (\Exception $e) {
            Log::error('Thumbnail processing failed', [
                'image_thumbnail_id' => $this->imageThumbnail->id,
                'error' => $e->getMessage()
            ]);

            $this->imageThumbnail->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'processed_at' => now(),
            ]);

            // Send notification about failure
            $this->sendThumbnailNotification();

            $this->updateBulkRequestCounters();
        }
    }

    /**
     * Simulate Node.js service processing with priority-based delays
     */
    private function simulateNodeServiceProcessing(): void
    {
        // Priority-based processing time (higher priority = faster processing)
        // Base processing time: 1-5 seconds
        $baseProcessingTime = rand(1, 5);
        
        // Priority multiplier: higher priority = faster processing
        $priorityMultiplier = 1 / $this->priority; // 1x, 0.5x, 0.33x
        
        // Calculate final processing time
        $processingTime = max(1, round($baseProcessingTime * $priorityMultiplier));
        
        // Log priority processing information
        Log::info('Processing thumbnail with priority', [
            'image_thumbnail_id' => $this->imageThumbnail->id,
            'priority' => $this->priority,
            'base_time' => $baseProcessingTime,
            'final_time' => $processingTime,
            'user_tier' => $this->imageThumbnail->bulkRequest->user->subscription_tier ?? 'unknown'
        ]);
        
        // Simulate processing time
        sleep($processingTime);

        // Simulate occasional service errors (lower chance for higher priority users)
        $errorChance = max(1, 5 / $this->priority); // 5%, 2.5%, 1.67%
        if (rand(1, 100) <= $errorChance) {
            throw new \Exception('Simulated Node.js service error (Priority: ' . $this->priority . ')');
        }
    }

    /**
     * Update bulk request counters
     */
    private function updateBulkRequestCounters(): void
    {
        $bulkRequest = $this->imageThumbnail->bulkRequest;
        
        $processedCount = $bulkRequest->imageThumbnails()
            ->where('status', 'processed')
            ->count();
            
        $failedCount = $bulkRequest->imageThumbnails()
            ->where('status', 'failed')
            ->count();

        $bulkRequest->update([
            'processed_images' => $processedCount,
            'failed_images' => $failedCount,
        ]);

        // Check if all images are processed
        $totalImages = $bulkRequest->imageThumbnails()->count();
        if (($processedCount + $failedCount) >= $totalImages) {
            $bulkRequest->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Send notification about bulk request completion
            $this->sendBulkRequestCompletionNotification($bulkRequest);
        }
    }

    /**
     * Send notification about thumbnail completion
     */
    private function sendThumbnailNotification(): void
    {
        try {
            $user = $this->imageThumbnail->bulkRequest->user;
            $user->notify(new ThumbnailReadyNotification($this->imageThumbnail));
        } catch (\Exception $e) {
            Log::error('Failed to send thumbnail notification', [
                'image_thumbnail_id' => $this->imageThumbnail->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send notification about bulk request completion
     */
    private function sendBulkRequestCompletionNotification(BulkRequest $bulkRequest): void
    {
        try {
            $user = $bulkRequest->user;
            $user->notify(new BulkRequestCompletedNotification($bulkRequest));
        } catch (\Exception $e) {
            Log::error('Failed to send bulk request completion notification', [
                'bulk_request_id' => $bulkRequest->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}
