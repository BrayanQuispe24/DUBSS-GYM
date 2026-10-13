<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    protected $appends = [
        'cupos_ocupados',
        'cupos_disponibles',
    ];

    public function horario(): BelongsTo
    {
        return $this->belongsTo(Horario::class, 'id_horario');
    }

    public function disciplina(): BelongsTo
    {
        return $this->belongsTo(Disciplina::class, 'id_disciplina');
    }

    public function formulariosSolicitud(): HasMany
    {
        return $this->hasMany(FormularioSolicitud::class, 'id_disciplina_horario');
    }

    public function boletasInscripcion(): HasMany
    {
        return $this->hasMany(BoletaInscripcion::class, 'id_disciplina_horario');
    }

    public function getCuposOcupadosAttribute(): int
    {
        $hoy = now()->toDateString();

        // 1. Boletas de inscripción activas y con vigencia actual para este horario
        $boletasActivas = BoletaInscripcion::where(function ($q) {
            $q->where('id_disciplina_horario', $this->id);
            // Soporte retrocompatible por si existen boletas previas sin id_disciplina_horario asignado
            if ($this->relationLoaded('disciplina') && $this->relationLoaded('horario') && $this->disciplina && $this->horario) {
                $q->orWhere(function ($sub) {
                    $sub->whereNull('id_disciplina_horario')
                        ->where('disciplina', $this->disciplina->nombre)
                        ->where('hora_inicio', $this->horario->hora_inicio);
                });
            }
        })
            ->where('estado', 'activo')
            ->where(function ($q) use ($hoy) {
                $q->whereNull('fecha_fin')->orWhere('fecha_fin', '>=', $hoy);
            })
            ->count();

        // 2. Solicitudes en trámite (pendiente/aprobado) que aún no tienen pago completado / boleta emitida
        $solicitudesEnTramite = FormularioSolicitud::where(function ($q) {
            $q->where('id_disciplina_horario', $this->id)
                ->orWhere(function ($sub) {
                    $sub->whereNull('id_disciplina_horario')
                        ->where('id_disciplina', $this->id_disciplina);
                });
        })
            ->whereIn('estado', ['pendiente', 'aprobado'])
            ->whereDoesntHave('boletasPago', function ($q) {
                $q->where('estado', 'completado');
            })
            ->count();

        return $boletasActivas + $solicitudesEnTramite;
    }

    public function getCuposDisponiblesAttribute(): int
    {
        $max = $this->cupo_maximo ?? 0;

        return max(0, $max - $this->cupos_ocupados);
    }
}
