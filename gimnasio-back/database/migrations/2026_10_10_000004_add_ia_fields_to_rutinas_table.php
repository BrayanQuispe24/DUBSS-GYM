<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rutinas', function (Blueprint $table) {
            $table->boolean('generado_por_ia')->default(false)->after('estado');
            $table->json('justificacion_reglas')->nullable()->after('generado_por_ia');
            $table->foreignId('id_perfil_entrenamiento')->nullable()->after('justificacion_reglas')->constrained('perfiles_entrenamiento')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('rutinas', function (Blueprint $table) {
            $table->dropForeign(['id_perfil_entrenamiento']);
            $table->dropColumn(['generado_por_ia', 'justificacion_reglas', 'id_perfil_entrenamiento']);
        });
    }
};
