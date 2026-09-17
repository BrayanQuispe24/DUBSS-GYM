<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ejercicio_grupo_muscular', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_participacion')->nullable();
            $table->text('observacion')->nullable();
            $table->foreignId('id_ejercicio')->constrained('ejercicios')->onDelete('cascade');
            $table->foreignId('id_grupo_muscular')->constrained('grupo_muscular')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ejercicio_grupo_muscular');
    }
};
