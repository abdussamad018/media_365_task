<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BulkRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'image_urls',
        'status',
        'priority',
        'total_images',
        'processed_images',
        'failed_images',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user that owns the bulk request.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the image thumbnails for the bulk request.
     */
    public function imageThumbnails()
    {
        return $this->hasMany(ImageThumbnail::class);
    }

    /**
     * Get the image URLs as an array.
     */
    public function getImageUrlsArrayAttribute(): array
    {
        return array_filter(explode("\n", $this->image_urls));
    }
}
