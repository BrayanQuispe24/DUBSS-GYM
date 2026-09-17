<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('antecedentes', function (Blueprint $table) {
            $table->id();
            $table->text('observaciones')->nullable();
            $table->boolean('tiene_enfermedades_cardiovasculares')->default(false);
            $table->text('detalle_enfermedades_cardiovasculares')->nullable();
            $table->boolean('se_realizo_intervencion_cardiovascular')->default(false);
            $table->text('detalle_intervencion_cardiovascular')->nullable();
            $table->boolean('tiene_hipertension_arterial')->default(false);
            $table->text('detalle_hipertension_arterial')->nullable();
            $table->boolean('tiene_enfermedades_pulmonares')->default(false);
            $table->text('detalle_enfermedades_pulmonares')->nullable();
            $table->boolean('tiene_diabetes')->default(false);
            $table->text('detalle_diabetes')->nullable();
            $table->boolean('tiene_enfermedades_osteoarticulares')->default(false);
            $table->text('detalle_enfermedades_osteoarticulares')->nullable();
            $table->boolean('tiene_enfermedades_neurologicas')->default(false);
            $table->text('detalle_enfermedades_neurologicas')->nullable();
            $table->boolean('tiene_convulsiones')->default(false);
            $table->text('detalle_convulsiones')->nullable();
            $table->boolean('tiene_intervencion_quirurgica')->default(false);
            $table->text('detalle_intervencion_quirurgica')->nullable();
            $table->boolean('sufrio_fracturas_oseas')->default(false);
            $table->text('detalle_fracturas_oseas')->nullable();
            $table->boolean('sufrio_algun_sintoma_durante_deporte')->default(false);
            $table->text('detalle_sintomas_durante_deporte')->nullable();
            $table->boolean('tiene_lesiones')->default(false);
            $table->text('detalle_lesiones')->nullable();
            $table->boolean('tiene_alergias')->default(false);
            $table->text('detalle_alergias')->nullable();
            $table->foreignId('id_historial')->constrained('historiales')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('antecedentes');
    }
};
