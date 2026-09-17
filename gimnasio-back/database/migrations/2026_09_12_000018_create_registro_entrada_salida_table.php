<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registro_entrada_salida', function (Blueprint $table) {
            $table->id();
            $table->timestamp('fecha_hora')->nullable();
            $table->string('tipo')->nullable();
            $table->foreignId('id_boleta_inscripcion')->nullable()->constrained('boleta_inscripcion')->onDelete('cascade');
            $table->foreignId('id_usuario')->nullable()->constrained('usuarios')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registro_entrada_salida');
    }
};
