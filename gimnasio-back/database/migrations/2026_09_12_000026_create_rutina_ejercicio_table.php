<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rutina_ejercicio', function (Blueprint $table) {
            $table->id();
            $table->integer('series')->nullable();
            $table->integer('repeticiones')->nullable();
            $table->decimal('peso', 8, 2)->nullable();
            $table->integer('duracion_segundos')->nullable();
            $table->integer('descanso_segundos')->nullable();
            $table->integer('orden')->nullable();
            $table->text('observacion')->nullable();
            $table->foreignId('id_ejercicio')->constrained('ejercicios')->onDelete('cascade');
            $table->foreignId('id_rutina')->constrained('rutinas')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rutina_ejercicio');
    }
};
