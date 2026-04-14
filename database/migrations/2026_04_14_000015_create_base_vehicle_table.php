<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('base_vehicle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('base_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->date('assigned_at');
            $table->date('removed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('base_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('base_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('assigned_at');
            $table->date('removed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('base_user');
        Schema::dropIfExists('base_vehicle');
    }
};
