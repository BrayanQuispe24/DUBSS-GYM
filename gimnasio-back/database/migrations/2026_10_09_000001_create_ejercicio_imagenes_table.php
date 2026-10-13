<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ejercicio_imagenes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_ejercicio')->constrained('ejercicios')->onDelete('cascade');
            $table->string('path_imagen');
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->integer('orden')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ejercicio_imagenes');
    }
};
