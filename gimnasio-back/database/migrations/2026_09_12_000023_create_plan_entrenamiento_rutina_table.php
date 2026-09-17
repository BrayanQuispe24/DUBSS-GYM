<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_entrenamiento_rutina', function (Blueprint $table) {
            $table->id();
            $table->string('dia_semana')->nullable();
            $table->foreignId('id_plan_entrenamiento')->constrained('plan_entrenamientos')->onDelete('cascade');
            $table->foreignId('id_rutina')->constrained('rutinas')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_entrenamiento_rutina');
    }
};
