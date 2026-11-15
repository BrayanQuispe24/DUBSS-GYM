<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            if (!Schema::hasColumn('usuarios', 'telegram_chat_id')) {
                $table->string('telegram_chat_id')->nullable()->after('celular')->index();
            }
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            if (Schema::hasColumn('usuarios', 'telegram_chat_id')) {
                $table->dropIndex(['telegram_chat_id']);
                $table->dropColumn('telegram_chat_id');
            }
        });
    }
};

