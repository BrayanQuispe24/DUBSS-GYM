<?php

namespace App\Actions\Entrenamiento;

use App\Models\PlanEntrenamiento;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class ListarPlanesEntrenamientoAction
{
    public function execute(?Usuario $user = null): Collection
    {
        $query = PlanEntrenamiento::with([
            'usuario',
            'planEntrenamientoRutinas.rutina.rutinaEjercicios.ejercicio.tipoEjercicio',
            'planEntrenamientoRutinas.rutina.rutinaEjercicios.ejercicio.imagenes',
        ]);

        if ($user) {
            $user->loadMissing(['rol', 'disciplina']);
            $rolNombre = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? 'cliente'));

            if ($rolNombre === 'instructor') {
                $discNombre = $user->disciplina->nombre ?? null;
                if ($discNombre) {
                    $query->where(function ($q) use ($user, $discNombre) {
                        $q->where('id_usuario', $user->id)
                            ->orWhereHas('usuario.boletasInscripcion', function ($bq) use ($discNombre) {
                                $bq->where('estado', 'activo')
                                    ->whereRaw('LOWER(disciplina) = ?', [strtolower($discNombre)]);
                            });
                    });
                } else {
                    $query->where('id_usuario', $user->id);
                }
            } elseif ($rolNombre !== 'administrador') {
                $query->where('id_usuario', $user->id);
            }
        }

        return $query->orderBy('created_at', 'desc')->get();
    }
}
