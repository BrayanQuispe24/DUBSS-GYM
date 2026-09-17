<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formulario_solicitud', function (Blueprint $table) {
            $table->id();
            $table->string('numero_formulario');
            $table->string('estado')->default('pendiente');
            $table->timestamp('fecha_registro')->nullable();
            $table->foreignId('id_disciplina')->constrained('disciplinas')->onDelete('cascade');
            $table->foreignId('id_usuario')->constrained('usuarios')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formulario_solicitud');
    }
};
