<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanEntrenamiento extends Model
{
    use HasFactory;

    protected $table = 'plan_entrenamientos';

    protected $fillable = [
        'nombre',
        'objetivo',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'observacion',
        'id_usuario',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function planEntrenamientoRutinas(): HasMany
    {
        return $this->hasMany(PlanEntrenamientoRutina::class, 'id_plan_entrenamiento');
    }
}
