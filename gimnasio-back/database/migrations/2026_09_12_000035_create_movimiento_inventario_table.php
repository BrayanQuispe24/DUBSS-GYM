<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimiento_inventario', function (Blueprint $table) {
            $table->id();
            $table->timestamp('fecha_hora')->nullable();
            $table->string('motivo')->nullable();
            $table->text('observacion')->nullable();
            $table->integer('cantidad');
            $table->foreignId('id_tipo_movimiento')->constrained('tipo_movimiento')->onDelete('cascade');
            $table->foreignId('id_equipo')->constrained('equipos')->onDelete('cascade');
            $table->foreignId('id_usuario')->nullable()->constrained('usuarios')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimiento_inventario');
    }
};
