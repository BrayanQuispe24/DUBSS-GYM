<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('boleta_inscripcion', function (Blueprint $table) {
            $table->foreignId('id_disciplina_horario')->nullable()->constrained('disciplina_horario')->nullOnDelete();
            $table->foreignId('id_disciplina')->nullable()->constrained('disciplinas')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('boleta_inscripcion', function (Blueprint $table) {
            $table->dropForeign(['id_disciplina_horario']);
            $table->dropForeign(['id_disciplina']);
            $table->dropColumn(['id_disciplina_horario', 'id_disciplina']);
        });
    }
};
