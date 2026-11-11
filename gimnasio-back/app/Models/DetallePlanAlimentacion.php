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

    protected $appends = [
        'descripcion',
        'calorias',
    ];

    public function getDescripcionAttribute(): ?string
    {
        return $this->alimento ?? null;
    }

    public function getCaloriasAttribute(): ?float
    {
        return isset($this->cantidad) ? (float) $this->cantidad : null;
    }

    public function planAlimentacion(): BelongsTo
    {
        return $this->belongsTo(PlanAlimentacion::class, 'id_plan_alimentacion');
    }
}
