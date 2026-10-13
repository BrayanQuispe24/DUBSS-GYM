<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rutina extends Model
{
    use HasFactory;

    protected $table = 'rutinas';

    protected $fillable = [
        'nombre',
        'descripcion',
        'nivel',
        'estado',
        'generado_por_ia',
        'justificacion_reglas',
        'id_perfil_entrenamiento',
    ];

    protected $casts = [
        'generado_por_ia' => 'boolean',
        'estado' => 'boolean',
        'justificacion_reglas' => 'array',
    ];

    public function perfilEntrenamiento(): BelongsTo
    {
        return $this->belongsTo(PerfilEntrenamiento::class, 'id_perfil_entrenamiento');
    }

    public function planEntrenamientoRutinas(): HasMany
    {
        return $this->hasMany(PlanEntrenamientoRutina::class, 'id_rutina');
    }

    public function rutinaEjercicios(): HasMany
    {
        return $this->hasMany(RutinaEjercicio::class, 'id_rutina');
    }
}
