<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_alimentacion', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('objetivo')->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->text('observacion')->nullable();
            $table->boolean('estado')->default(true);
            $table->foreignId('id_usuario')->nullable()->constrained('usuarios')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_alimentacion');
    }
};
