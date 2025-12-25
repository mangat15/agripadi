<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('forum_likes', function (Blueprint $table) {
            // Add unique constraint to prevent duplicate likes
            $table->unique(['forum_id', 'user_id'], 'forum_likes_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('forum_likes', function (Blueprint $table) {
            // Drop the unique constraint
            $table->dropUnique('forum_likes_unique');
        });
    }
};
