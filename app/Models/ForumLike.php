<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForumLike extends Model
{
    protected $fillable = [
        'forum_id',
        'user_id',
    ];

    public function forum(): BelongsTo
    {
        return $this->belongsTo(Forum::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}