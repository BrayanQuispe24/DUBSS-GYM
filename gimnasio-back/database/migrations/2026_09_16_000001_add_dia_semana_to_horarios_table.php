<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('horarios', function (Blueprint $table) {
            if (!Schema::hasColumn('horarios', 'dia_semana')) {
                $table->string('dia_semana')->nullable()->after('id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('horarios', function (Blueprint $table) {
            if (Schema::hasColumn('horarios', 'dia_semana')) {
                $table->dropColumn('dia_semana');
            }
        });
    }
};
