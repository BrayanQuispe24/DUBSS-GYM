<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tipo_movimiento', function (Blueprint $table) {
            $table->boolean('es_salida')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('tipo_movimiento', function (Blueprint $table) {
            $table->dropColumn('es_salida');
        });
    }
};
