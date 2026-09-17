<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->nullable();
            $table->string('nombre');
            $table->string('apellido');
            $table->boolean('estado')->default(true);
            $table->string('ci')->nullable();
            $table->string('celular')->nullable();
            $table->string('email')->unique();
            $table->boolean('acepta_terminos')->default(true);
            $table->timestamp('fecha_acepta_terminos')->nullable();
            $table->enum('tipo_usuario', ['estudiante', 'docente', 'administrativo', 'particular'])->default('estudiante');
            $table->timestamp('fecha_registro')->nullable();
            $table->string('password');
            $table->foreignId('id_rol')->constrained('roles')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
