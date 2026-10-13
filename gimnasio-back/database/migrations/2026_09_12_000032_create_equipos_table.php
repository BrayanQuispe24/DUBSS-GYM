<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->nullable();
            $table->string('nombre');
            $table->string('modelo')->nullable();
            $table->date('fecha_adquisicion')->nullable();
            $table->decimal('precio_compra', 10, 2)->nullable();
            $table->boolean('estado')->default(true);
            $table->integer('cantidad')->default(1);
            $table->foreignId('id_ambiente')->nullable()->constrained('ambientes')->onDelete('cascade');
            $table->foreignId('id_marca')->nullable()->constrained('marcas')->onDelete('cascade');
            $table->foreignId('id_tipo_equipo')->nullable()->constrained('tipo_equipo')->onDelete('cascade');
            $table->string('imagen_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipos');
    }
};
