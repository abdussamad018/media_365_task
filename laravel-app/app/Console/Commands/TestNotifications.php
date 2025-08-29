<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\BulkRequestCompletedNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class TestNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:test {user_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the notification system by sending sample notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user_id');
        
        if ($userId) {
            $user = User::find($userId);
            if (!$user) {
                $this->error("User with ID {$userId} not found!");
                return 1;
            }
        } else {
            $user = User::first();
            if (!$user) {
                $this->error("No users found in the database!");
                return 1;
            }
        }

        $this->info("Testing notifications for user: {$user->name} ({$user->email})");

        // Create a test bulk request
        $bulkRequest = \App\Models\BulkRequest::create([
            'user_id' => $user->id,
            'image_urls' => "https://example.com/test-image1.jpg\nhttps://example.com/test-image2.jpg",
            'total_images' => 2,
            'processed_images' => 1,
            'failed_images' => 1,
            'status' => 'completed',
            'priority' => 1,
            'completed_at' => now()
        ]);

        // Create a test image thumbnail
        $imageThumbnail = \App\Models\ImageThumbnail::create([
            'bulk_request_id' => $bulkRequest->id,
            'image_url' => 'https://example.com/test-image.jpg',
            'status' => 'processed',
            'thumbnail_path' => '/thumbnails/test-thumbnail.jpg',
            'processed_at' => now()
        ]);

        // Test bulk request completed notification
        $this->info("Sending bulk request completed notification...");
        $user->notify(new BulkRequestCompletedNotification($bulkRequest));

        $this->info("✅ Test notifications sent successfully!");
        $this->info("Check the notifications table and user dashboard to see the results.");

        return 0;
    }
}
