<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('preoperational_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inspection_id')->constrained('preoperational_inspections')->cascadeOnDelete();
            $table->foreignId('item_id')->constrained('preoperational_items')->cascadeOnDelete();
            $table->enum('value', ['ok', 'fail', 'na'])->default('ok');
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('preoperational_responses');
    }
};
