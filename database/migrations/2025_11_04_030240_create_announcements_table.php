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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Admin who created
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->string('category')->nullable(); // Workshop, Program, News, etc.
            $table->string('image')->nullable(); // Optional poster/image
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};