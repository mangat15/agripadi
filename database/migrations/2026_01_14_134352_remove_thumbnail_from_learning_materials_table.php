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
        // Only drop if column exists (for existing databases)
        if (Schema::hasColumn('learning_materials', 'thumbnail')) {
            Schema::table('learning_materials', function (Blueprint $table) {
                $table->dropColumn('thumbnail');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('learning_materials', function (Blueprint $table) {
            $table->string('thumbnail')->nullable()->after('video_url');
        });
    }
};
