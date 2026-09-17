<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EjercicioGrupoMuscular extends Model
{
    use HasFactory;

    protected $table = 'ejercicio_grupo_muscular';

    protected $fillable = [
        'tipo_participacion',
        'observacion',
        'id_ejercicio',
        'id_grupo_muscular',
    ];

    public function ejercicio(): BelongsTo
    {
        return $this->belongsTo(Ejercicio::class, 'id_ejercicio');
    }

    public function grupoMuscular(): BelongsTo
    {
        return $this->belongsTo(GrupoMuscular::class, 'id_grupo_muscular');
    }
}
