<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ejercicio extends Model
{
    use HasFactory;

    protected $table = 'ejercicios';

    protected $fillable = [
        'nombre',
        'descripcion',
        'url_video',
        'id_tipo_ejercicio',
        'codigo_externo',
        'equipamiento',
        'nivel_dificultad',
        'mecanica',
        'patron_movimiento',
        'fuente_origen',
    ];

    public function tipoEjercicio(): BelongsTo
    {
        return $this->belongsTo(TipoEjercicio::class, 'id_tipo_ejercicio');
    }

    public function rutinaEjercicios(): HasMany
    {
        return $this->hasMany(RutinaEjercicio::class, 'id_ejercicio');
    }

    public function ejercicioGrupoMusculares(): HasMany
    {
        return $this->hasMany(EjercicioGrupoMuscular::class, 'id_ejercicio');
    }

    public function imagenes(): HasMany
    {
        return $this->hasMany(EjercicioImagen::class, 'id_ejercicio')->orderBy('orden', 'asc');
    }
}
