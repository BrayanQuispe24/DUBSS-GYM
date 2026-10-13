<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('formulario_solicitud', function (Blueprint $table) {
            $table->foreignId('id_disciplina_horario')
                ->nullable()
                ->after('id_disciplina')
                ->constrained('disciplina_horario')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('formulario_solicitud', function (Blueprint $table) {
            $table->dropForeign(['id_disciplina_horario']);
            $table->dropColumn('id_disciplina_horario');
        });
    }
};
