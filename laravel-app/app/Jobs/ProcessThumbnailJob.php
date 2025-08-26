<?php

namespace App\Jobs;

use App\Models\ImageThumbnail;
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

            $this->updateBulkRequestCounters();
        }
    }

    /**
     * Simulate Node.js service processing with delay
     */
    private function simulateNodeServiceProcessing(): void
    {
        // Simulate processing time (1-5 seconds)
        $processingTime = rand(1, 5);
        sleep($processingTime);

        // Simulate occasional service errors
        if (rand(1, 100) <= 5) {
            throw new \Exception('Simulated Node.js service error');
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
        }
    }
}
