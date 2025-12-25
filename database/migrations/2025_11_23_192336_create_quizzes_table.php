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
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category'); // Links to learning material category
            $table->unsignedBigInteger('learning_material_id')->nullable();
            $table->foreign('learning_material_id')->references('id')->on('learning_materials')->onDelete('cascade');
            $table->integer('passing_score')->default(70); // Percentage needed to pass
            $table->integer('time_limit')->nullable(); // Time limit in minutes
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')->references('user_id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
