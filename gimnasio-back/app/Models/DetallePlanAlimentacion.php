<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetallePlanAlimentacion extends Model
{
    use HasFactory;

    protected $table = 'detalle_plan_alimentacion';

    protected $fillable = [
        'dia_semana',
        'tipo_comida',
        'alimento',
        'cantidad',
        'unidad',
        'hora',
        'observacion',
        'id_plan_alimentacion',
    ];

    public function planAlimentacion(): BelongsTo
    {
        return $this->belongsTo(PlanAlimentacion::class, 'id_plan_alimentacion');
    }
}
