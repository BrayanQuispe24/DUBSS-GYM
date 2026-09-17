<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mantenimientos', function (Blueprint $table) {
            $table->id();
            $table->string('tipo')->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->text('descripcion')->nullable();
            $table->decimal('costo', 10, 2)->nullable();
            $table->boolean('estado')->default(true);
            $table->date('proximo_mantenimiento')->nullable();
            $table->text('observacion')->nullable();
            $table->foreignId('id_equipo')->constrained('equipos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mantenimientos');
    }
};
