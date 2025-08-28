<?php

namespace App\Notifications;

use App\Models\BulkRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BulkRequestCompletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $bulkRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(BulkRequest $bulkRequest)
    {
        $this->bulkRequest = $bulkRequest;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $totalImages = $this->bulkRequest->total_images;
        $processedImages = $this->bulkRequest->processed_images;
        $failedImages = $this->bulkRequest->failed_images;
        $successRate = $totalImages > 0 ? round(($processedImages / $totalImages) * 100, 1) : 0;

        $subject = $failedImages === 0 
            ? "🎉 All {$totalImages} thumbnails are ready!" 
            : "✅ Bulk request completed with {$successRate}% success rate";

        return (new MailMessage)
            ->subject($subject)
            ->greeting("Hello {$notifiable->name}!")
            ->line("Your bulk thumbnail request has been completed!")
            ->line("📊 Processing Summary:")
            ->line("• Total Images: {$totalImages}")
            ->line("• Successfully Processed: {$processedImages}")
            ->line("• Failed: {$failedImages}")
            ->line("• Success Rate: {$successRate}%")
            ->action('View Results', url('/dashboard'))
            ->line('Thank you for using our service!');
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        $totalImages = $this->bulkRequest->total_images;
        $processedImages = $this->bulkRequest->processed_images;
        $failedImages = $this->bulkRequest->failed_images;
        $successRate = $totalImages > 0 ? round(($processedImages / $totalImages) * 100, 1) : 0;

        return [
            'bulk_request_id' => $this->bulkRequest->id,
            'total_images' => $totalImages,
            'processed_images' => $processedImages,
            'failed_images' => $failedImages,
            'success_rate' => $successRate,
            'message' => "Bulk request #{$this->bulkRequest->id} completed with {$successRate}% success rate",
            'completed_at' => $this->bulkRequest->completed_at,
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $totalImages = $this->bulkRequest->total_images;
        $processedImages = $this->bulkRequest->processed_images;
        $failedImages = $this->bulkRequest->failed_images;
        $successRate = $totalImages > 0 ? round(($processedImages / $totalImages) * 100, 1) : 0;

        return [
            'id' => $this->id,
            'type' => 'bulk_request_completed',
            'bulk_request_id' => $this->bulkRequest->id,
            'total_images' => $totalImages,
            'processed_images' => $processedImages,
            'failed_images' => $failedImages,
            'success_rate' => $successRate,
            'message' => "Bulk request #{$this->bulkRequest->id} completed with {$successRate}% success rate",
            'completed_at' => $this->bulkRequest->completed_at,
        ];
    }
}
