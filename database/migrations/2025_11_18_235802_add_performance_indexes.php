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
        // Add indexes on frequently queried columns for better performance
        // Using try-catch to avoid duplicate key errors if indexes already exist

        try {
            Schema::table('reports', function (Blueprint $table) {
                $table->index('status');
            });
        } catch (\Exception $e) {
            // Index already exists, skip
        }

        // forums.status index may already exist, skip it
        // Schema already has this index

        try {
            Schema::table('announcements', function (Blueprint $table) {
                $table->index('published_at');
            });
        } catch (\Exception $e) {
            // Index already exists, skip
        }

        try {
            Schema::table('feedback', function (Blueprint $table) {
                $table->index('is_read');
            });
        } catch (\Exception $e) {
            // Index already exists, skip
        }

        try {
            Schema::table('feedback', function (Blueprint $table) {
                $table->index('type');
            });
        } catch (\Exception $e) {
            // Index already exists, skip
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('forums', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('announcements', function (Blueprint $table) {
            $table->dropIndex(['published_at']);
        });

        Schema::table('feedback', function (Blueprint $table) {
            $table->dropIndex(['is_read']);
            $table->dropIndex(['type']);
        });
    }
};
