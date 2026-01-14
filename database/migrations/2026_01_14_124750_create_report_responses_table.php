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
        Schema::create('report_responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('report_id');
            $table->foreign('report_id')->references('id')->on('reports')->onDelete('cascade');
            $table->unsignedBigInteger('admin_id'); // Admin who responded
            $table->foreign('admin_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->text('response'); // Admin response text
            $table->enum('response_type', ['update', 'resolved'])->default('update'); // update or resolved
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_responses');
    }
};
