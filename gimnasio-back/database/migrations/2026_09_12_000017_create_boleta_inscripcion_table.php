<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boleta_inscripcion', function (Blueprint $table) {
            $table->id();
            $table->string('numero_boleta');
            $table->date('fecha_inscripcion')->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->decimal('monto', 10, 2);
            $table->string('estado')->default('activo');
            $table->string('disciplina')->nullable();
            $table->time('hora_inicio')->nullable();
            $table->time('hora_salida')->nullable();
            $table->foreignId('id_tarifa')->nullable()->constrained('tarifas')->onDelete('cascade');
            $table->foreignId('id_usuario')->nullable()->constrained('usuarios')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('boleta_inscripcion');
    }
};
