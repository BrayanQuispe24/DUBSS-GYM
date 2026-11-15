<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notificaciones_membresia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_boleta_inscripcion')->constrained('boleta_inscripcion')->onDelete('cascade');
            $table->foreignId('id_usuario')->constrained('usuarios')->onDelete('cascade');
            $table->date('fecha_vencimiento');
            $table->integer('dias_restantes');
            $table->string('canal', 30)->default('telegram');
            $table->string('estado', 20)->default('enviado'); // 'enviado', 'fallido'
            $table->string('telegram_message_id', 100)->nullable();
            $table->text('error_motivo')->nullable();
            $table->timestamp('fecha_envio')->useCurrent();
            $table->timestamps();

            // Restricción de unicidad para evitar duplicados del mismo aviso
            $table->unique(
                ['id_boleta_inscripcion', 'fecha_vencimiento', 'dias_restantes', 'canal'],
                'notif_boleta_venc_dias_canal_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones_membresia');
    }
};

