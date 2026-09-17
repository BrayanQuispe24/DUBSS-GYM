<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boleta_pago', function (Blueprint $table) {
            $table->id();
            $table->string('numero_boleta');
            $table->timestamp('fecha_pago')->nullable();
            $table->decimal('monto', 10, 2);
            $table->string('metodo_pago')->nullable();
            $table->string('concepto')->nullable();
            $table->string('estado')->default('pendiente');
            $table->string('comprobante_url')->nullable();
            $table->foreignId('id_formulario')->constrained('formulario_solicitud')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('boleta_pago');
    }
};
