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

    protected $appends = [
        'total_cupos_ocupados',
        'total_cupos_disponibles',
    ];

    public function disciplinaHorarios(): HasMany
    {
        return $this->hasMany(DisciplinaHorario::class, 'id_disciplina');
    }

    public function formularioSolicitudes(): HasMany
    {
        return $this->hasMany(FormularioSolicitud::class, 'id_disciplina');
    }

    public function boletasInscripcion(): HasMany
    {
        return $this->hasMany(BoletaInscripcion::class, 'id_disciplina');
    }

    public function getTotalCuposOcupadosAttribute(): int
    {
        return $this->disciplinaHorarios->sum('cupos_ocupados');
    }

    public function getTotalCuposDisponiblesAttribute(): int
    {
        $max = $this->cantidad_cupos ?? $this->disciplinaHorarios->sum('cupo_maximo');

        return max(0, $max - $this->total_cupos_ocupados);
    }
}
