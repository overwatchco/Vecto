<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contract_vehicle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->date('assigned_at');
            $table->date('removed_at')->nullable();
            $table->timestamps();

            $table->unique(['contract_id', 'vehicle_id', 'assigned_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contract_vehicle');
    }
};
