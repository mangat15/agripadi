<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VirtualTour extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'thumbnail',
        'tour_url',
        'tour_type',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    protected $with = ['user'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')->where('published_at', '<=', now());
    }
}
