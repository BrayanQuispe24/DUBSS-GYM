<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Antecedente extends Model
{
    use HasFactory;

    protected $table = 'antecedentes';

    protected $fillable = [
        'observaciones',
        'tiene_enfermedades_cardiovasculares',
        'detalle_enfermedades_cardiovasculares',
        'se_realizo_intervencion_cardiovascular',
        'detalle_intervencion_cardiovascular',
        'tiene_hipertension_arterial',
        'detalle_hipertension_arterial',
        'tiene_enfermedades_pulmonares',
        'detalle_enfermedades_pulmonares',
        'tiene_diabetes',
        'detalle_diabetes',
        'tiene_enfermedades_osteoarticulares',
        'detalle_enfermedades_osteoarticulares',
        'tiene_enfermedades_neurologicas',
        'detalle_enfermedades_neurologicas',
        'tiene_convulsiones',
        'detalle_convulsiones',
        'tiene_intervencion_quirurgica',
        'detalle_intervencion_quirurgica',
        'sufrio_fracturas_oseas',
        'detalle_fracturas_oseas',
        'sufrio_algun_sintoma_durante_deporte',
        'detalle_sintomas_durante_deporte',
        'tiene_lesiones',
        'detalle_lesiones',
        'tiene_alergias',
        'detalle_alergias',
        'id_historial',
    ];

    public function historial(): BelongsTo
    {
        return $this->belongsTo(Historial::class, 'id_historial');
    }
}
