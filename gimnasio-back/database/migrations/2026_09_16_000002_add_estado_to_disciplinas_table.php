<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('disciplinas', function (Blueprint $table) {
            if (!Schema::hasColumn('disciplinas', 'estado')) {
                $table->string('estado')->default('activo')->after('cantidad_cupos');
            }
        });
    }

    public function down(): void
    {
        Schema::table('disciplinas', function (Blueprint $table) {
            if (Schema::hasColumn('disciplinas', 'estado')) {
                $table->dropColumn('estado');
            }
        });
    }
};
