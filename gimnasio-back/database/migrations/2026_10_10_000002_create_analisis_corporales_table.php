<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analisis_corporales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('usuarios')->onDelete('cascade');
            $table->timestamp('fecha_analisis')->useCurrent();
            $table->string('path_foto_frontal')->nullable();
            $table->string('path_foto_perfil')->nullable();
            $table->string('path_foto_espalda')->nullable();
            $table->json('puntos_frontales')->nullable();
            $table->json('puntos_perfil')->nullable();
            $table->json('puntos_espalda')->nullable();
            $table->json('metricas_calculadas')->nullable();
            $table->string('calidad_analisis')->default('ACEPTABLE');
            $table->float('confianza_promedio')->nullable();
            $table->string('version_procesamiento')->default('v1.0');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analisis_corporales');
    }
};
