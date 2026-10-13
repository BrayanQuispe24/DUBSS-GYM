<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ejercicios', function (Blueprint $table) {
            $table->string('codigo_externo')->nullable()->unique()->after('id');
            $table->string('equipamiento')->nullable()->after('descripcion');
            $table->string('nivel_dificultad')->nullable()->after('equipamiento');
            $table->string('mecanica')->nullable()->after('nivel_dificultad');
            $table->string('patron_movimiento')->nullable()->after('mecanica');
            $table->string('fuente_origen')->default('free-exercise-db')->after('patron_movimiento');
        });
    }

    public function down(): void
    {
        Schema::table('ejercicios', function (Blueprint $table) {
            $table->dropColumn([
                'codigo_externo',
                'equipamiento',
                'nivel_dificultad',
                'mecanica',
                'patron_movimiento',
                'fuente_origen',
            ]);
        });
    }
};
