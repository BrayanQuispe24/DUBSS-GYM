<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanEntrenamientoRutina extends Model
{
    use HasFactory;

    protected $table = 'plan_entrenamiento_rutina';

    protected $fillable = [
        'dia_semana',
        'id_plan_entrenamiento',
        'id_rutina',
    ];

    public function planEntrenamiento(): BelongsTo
    {
        return $this->belongsTo(PlanEntrenamiento::class, 'id_plan_entrenamiento');
    }

    public function rutina(): BelongsTo
    {
        return $this->belongsTo(Rutina::class, 'id_rutina');
    }
}
