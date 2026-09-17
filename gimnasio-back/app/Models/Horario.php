<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Horario extends Model
{
    use HasFactory;

    protected $table = 'horarios';

    protected $fillable = [
        'dia_semana',
        'hora_inicio',
        'hora_fin',
    ];

    public function disciplinaHorarios(): HasMany
    {
        return $this->hasMany(DisciplinaHorario::class, 'id_horario');
    }
}
