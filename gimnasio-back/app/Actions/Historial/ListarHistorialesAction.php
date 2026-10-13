<?php

namespace App\Actions\Historial;

use App\Models\Historial;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class ListarHistorialesAction
{
    public function execute(Usuario $user): Collection
    {
        $user->loadMissing(['rol', 'disciplina']);
        $rol = mb_strtolower($user->rol->nombre ?? '');

        if ($rol === 'cliente') {
            return Historial::where('id_usuario', $user->id)->with(['usuario', 'detalles', 'antecedentes'])->get();
        }

        if ($rol === 'instructor') {
            $discNombre = $user->disciplina->nombre ?? null;
            if ($discNombre) {
                return Historial::where(function ($q) use ($user, $discNombre) {
                    $q->where('id_usuario', $user->id)
                        ->orWhereHas('usuario.boletasInscripcion', function ($bq) use ($discNombre) {
                            $bq->where('estado', 'activo')
                                ->whereRaw('LOWER(disciplina) = ?', [strtolower($discNombre)]);
                        });
                })->with(['usuario', 'detalles', 'antecedentes'])->get();
            }

            return Historial::where('id_usuario', $user->id)->with(['usuario', 'detalles', 'antecedentes'])->get();
        }

        return Historial::with(['usuario', 'detalles', 'antecedentes'])->get();
    }
}
