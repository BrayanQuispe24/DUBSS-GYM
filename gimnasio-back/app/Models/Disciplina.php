<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disciplina extends Model
{
    use HasFactory;

    protected $table = 'disciplinas';

    protected $fillable = [
        'nombre',
        'cantidad_cupos',
        'estado',
    ];

    public function disciplinaHorarios(): HasMany
    {
        return $this->hasMany(DisciplinaHorario::class, 'id_disciplina');
    }

    public function formularioSolicitudes(): HasMany
    {
        return $this->hasMany(FormularioSolicitud::class, 'id_disciplina');
    }
}
