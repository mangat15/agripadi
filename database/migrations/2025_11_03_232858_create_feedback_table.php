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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->enum('type', ['positive', 'improvement']); // Positive feedback or areas for improvement
            $table->text('message');
            $table->integer('rating')->nullable(); // Optional rating 1-5
            $table->string('feature')->nullable(); // Which feature they're giving feedback about
            $table->boolean('is_read')->default(false); // For admin to mark as read
            $table->text('admin_notes')->nullable(); // Admin can add internal notes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
