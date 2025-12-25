<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Forum extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'image',
        'category',
        'status',
        'likes_count',
        'comments_count',
        'approved_at',
        'approved_by',
        'rejection_reason',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'likes_count' => 'integer',
        'comments_count' => 'integer',
    ];

    protected $with = ['user'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by', 'user_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ForumComment::class)->orderBy('created_at', 'asc');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(ForumLike::class);
    }

    public function likedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'forum_likes', 'forum_id', 'user_id', 'id', 'user_id')->withTimestamps();
    }

    public function isLikedBy(User $user): bool
    {
        return $this->likes()->where('user_id', $user->user_id)->exists();
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}