<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisciplinaHorario extends Model
{
    use HasFactory;

    protected $table = 'disciplina_horario';

    protected $fillable = [
        'cupo_maximo',
        'estado',
        'id_horario',
        'id_disciplina',
    ];

    public function horario(): BelongsTo
    {
        return $this->belongsTo(Horario::class, 'id_horario');
    }

    public function disciplina(): BelongsTo
    {
        return $this->belongsTo(Disciplina::class, 'id_disciplina');
    }
}
