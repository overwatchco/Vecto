<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_costs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('registered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('maintenance_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('category', ['maintenance', 'fuel', 'materials', 'insurance', 'taxes', 'tolls', 'other']);
            $table->string('description');
            $table->decimal('amount', 12, 2);
            $table->date('date');
            $table->string('invoice_ref')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['vehicle_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_costs');
    }
};
