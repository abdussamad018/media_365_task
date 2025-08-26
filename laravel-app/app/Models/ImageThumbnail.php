<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageThumbnail extends Model
{
    use HasFactory;

    protected $fillable = [
        'bulk_request_id',
        'image_url',
        'status',
        'thumbnail_path',
        'error_message',
        'processed_at',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
    ];

    /**
     * Get the bulk request that owns the image thumbnail.
     */
    public function bulkRequest()
    {
        return $this->belongsTo(BulkRequest::class);
    }
}
