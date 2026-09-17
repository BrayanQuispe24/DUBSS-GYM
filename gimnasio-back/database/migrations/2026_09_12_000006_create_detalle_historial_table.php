<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalle_historial', function (Blueprint $table) {
            $table->id();
            $table->decimal('peso', 8, 2)->nullable();
            $table->decimal('altura', 8, 2)->nullable();
            $table->decimal('imc', 8, 2)->nullable();
            $table->decimal('porcentaje_grasa', 8, 2)->nullable();
            $table->decimal('masa_muscular', 8, 2)->nullable();
            $table->string('presion')->nullable();
            $table->timestamp('fecha_registro')->nullable();
            $table->foreignId('id_historial')->constrained('historiales')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalle_historial');
    }
};
