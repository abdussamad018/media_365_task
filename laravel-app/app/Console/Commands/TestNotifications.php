<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\ThumbnailReadyNotification;
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

        // Test thumbnail ready notification
        $this->info("Sending thumbnail ready notification...");
        $user->notify(new ThumbnailReadyNotification(
            new \App\Models\ImageThumbnail([
                'id' => 999,
                'image_url' => 'https://example.com/test-image.jpg',
                'status' => 'processed',
                'thumbnail_path' => '/thumbnails/test-thumbnail.jpg',
                'processed_at' => now(),
                'bulk_request_id' => 999
            ])
        ));

        // Test bulk request completed notification
        $this->info("Sending bulk request completed notification...");
        $user->notify(new BulkRequestCompletedNotification(
            new \App\Models\BulkRequest([
                'id' => 999,
                'total_images' => 5,
                'processed_images' => 4,
                'failed_images' => 1,
                'completed_at' => now()
            ])
        ));

        $this->info("✅ Test notifications sent successfully!");
        $this->info("Check the notifications table and user dashboard to see the results.");

        return 0;
    }
}
