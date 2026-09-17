<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disciplina_horario', function (Blueprint $table) {
            $table->id();
            $table->integer('cupo_maximo')->nullable();
            $table->boolean('estado')->default(true);
            $table->foreignId('id_horario')->constrained('horarios')->onDelete('cascade');
            $table->foreignId('id_disciplina')->constrained('disciplinas')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disciplina_horario');
    }
};
