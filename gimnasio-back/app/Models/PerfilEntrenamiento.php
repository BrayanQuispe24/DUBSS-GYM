<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PerfilEntrenamiento extends Model
{
    use HasFactory;

    protected $table = 'perfiles_entrenamiento';

    protected $fillable = [
        'id_usuario',
        'edad',
        'objetivo',
        'nivel_experiencia',
        'dias_disponibles',
        'duracion_sesion_min',
        'equipamiento_disponible',
        'restricciones_declaradas',
        'id_ultimo_analisis',
    ];

    protected $casts = [
        'edad' => 'integer',
        'dias_disponibles' => 'integer',
        'duracion_sesion_min' => 'integer',
        'equipamiento_disponible' => 'array',
        'restricciones_declaradas' => 'array',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function ultimoAnalisis(): BelongsTo
    {
        return $this->belongsTo(AnalisisCorporal::class, 'id_ultimo_analisis');
    }

    public function rutinas(): HasMany
    {
        return $this->hasMany(Rutina::class, 'id_perfil_entrenamiento');
    }
}
