<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perfiles_entrenamiento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('usuarios')->onDelete('cascade');
            $table->integer('edad')->nullable();
            $table->string('objetivo')->default('HIPERTROFIA');
            $table->string('nivel_experiencia')->default('PRINCIPIANTE');
            $table->integer('dias_disponibles')->default(3);
            $table->integer('duracion_sesion_min')->default(60);
            $table->json('equipamiento_disponible')->nullable();
            $table->json('restricciones_declaradas')->nullable();
            $table->foreignId('id_ultimo_analisis')->nullable()->constrained('analisis_corporales')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perfiles_entrenamiento');
    }
};
