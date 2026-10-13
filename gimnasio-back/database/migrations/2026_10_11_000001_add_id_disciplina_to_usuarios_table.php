<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            if (! Schema::hasColumn('usuarios', 'id_disciplina')) {
                $table->foreignId('id_disciplina')
                    ->nullable()
                    ->after('id_rol')
                    ->constrained('disciplinas')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            if (Schema::hasColumn('usuarios', 'id_disciplina')) {
                $table->dropForeign(['id_disciplina']);
                $table->dropColumn('id_disciplina');
            }
        });
    }
};
