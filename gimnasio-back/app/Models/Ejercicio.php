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
        'id_tipo_ejercicio',
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
}
