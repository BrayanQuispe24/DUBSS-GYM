<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_entrenamientos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('objetivo')->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->boolean('estado')->default(true);
            $table->text('observacion')->nullable();
            $table->foreignId('id_usuario')->nullable()->constrained('usuarios')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_entrenamientos');
    }
};
