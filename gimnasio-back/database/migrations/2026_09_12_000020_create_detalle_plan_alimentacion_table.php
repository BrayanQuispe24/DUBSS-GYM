<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalle_plan_alimentacion', function (Blueprint $table) {
            $table->id();
            $table->string('dia_semana')->nullable();
            $table->string('tipo_comida')->nullable();
            $table->string('alimento');
            $table->decimal('cantidad', 8, 2)->nullable();
            $table->string('unidad')->nullable();
            $table->time('hora')->nullable();
            $table->text('observacion')->nullable();
            $table->foreignId('id_plan_alimentacion')->constrained('plan_alimentacion')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalle_plan_alimentacion');
    }
};
