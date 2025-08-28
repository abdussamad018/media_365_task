<?php

namespace App\Notifications;

use App\Models\ImageThumbnail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;

class ThumbnailReadyNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $imageThumbnail;
    public $bulkRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(ImageThumbnail $imageThumbnail)
    {
        $this->imageThumbnail = $imageThumbnail;
        $this->bulkRequest = $imageThumbnail->bulkRequest;
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
        $status = $this->imageThumbnail->status;
        $subject = $status === 'processed' 
            ? '🎉 Your thumbnail is ready!' 
            : '⚠️ Thumbnail processing failed';

        return (new MailMessage)
            ->subject($subject)
            ->greeting("Hello {$notifiable->name}!")
            ->line($this->getStatusMessage())
            ->line("Image URL: {$this->imageThumbnail->image_url}")
            ->line("Request ID: #{$this->bulkRequest->id}")
            ->action('View Results', url('/dashboard'))
            ->line('Thank you for using our service!');
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'image_thumbnail_id' => $this->imageThumbnail->id,
            'bulk_request_id' => $this->bulkRequest->id,
            'image_url' => $this->imageThumbnail->image_url,
            'status' => $this->imageThumbnail->status,
            'message' => $this->getStatusMessage(),
            'processed_at' => $this->imageThumbnail->processed_at,
            'thumbnail_path' => $this->imageThumbnail->thumbnail_path,
            'error_message' => $this->imageThumbnail->error_message,
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'id' => $this->id,
            'type' => 'thumbnail_ready',
            'image_thumbnail_id' => $this->imageThumbnail->id,
            'bulk_request_id' => $this->bulkRequest->id,
            'image_url' => $this->imageThumbnail->image_url,
            'status' => $this->imageThumbnail->status,
            'message' => $this->getStatusMessage(),
            'processed_at' => $this->imageThumbnail->processed_at,
            'thumbnail_path' => $this->imageThumbnail->thumbnail_path,
            'error_message' => $this->imageThumbnail->error_message,
        ];
    }

    /**
     * Get the status message based on processing result
     */
    private function getStatusMessage(): string
    {
        return match($this->imageThumbnail->status) {
            'processed' => "Your thumbnail has been successfully processed and is ready for download!",
            'failed' => "Unfortunately, your thumbnail processing failed. Please check the error details.",
            default => "Your thumbnail processing status has been updated.",
        };
    }
}
