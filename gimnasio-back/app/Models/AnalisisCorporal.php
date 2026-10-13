<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalisisCorporal extends Model
{
    use HasFactory;

    protected $table = 'analisis_corporales';

    protected $fillable = [
        'id_usuario',
        'fecha_analisis',
        'path_foto_frontal',
        'path_foto_perfil',
        'path_foto_espalda',
        'puntos_frontales',
        'puntos_perfil',
        'puntos_espalda',
        'metricas_calculadas',
        'calidad_analisis',
        'confianza_promedio',
        'version_procesamiento',
        'observaciones',
    ];

    protected $casts = [
        'fecha_analisis' => 'datetime',
        'puntos_frontales' => 'array',
        'puntos_perfil' => 'array',
        'puntos_espalda' => 'array',
        'metricas_calculadas' => 'array',
        'confianza_promedio' => 'float',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
