<?php

namespace App\Http\Controllers;

use App\Actions\Entrenamiento\AsignarGrupoMuscularAction;
use App\Http\Requests\Entrenamiento\AsignarGrupoMuscularRequest;
use App\Models\EjercicioGrupoMuscular;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class EjercicioGrupoMuscularController extends Controller
{
    public function store(AsignarGrupoMuscularRequest $request, AsignarGrupoMuscularAction $action): JsonResponse
    {
        Gate::authorize('create', EjercicioGrupoMuscular::class);
        $relacion = $action->execute(
            (int) $request->validated('id_ejercicio'),
            (int) $request->validated('id_grupo_muscular')
        );

        return response()->json([
            'message' => 'Grupo muscular asignado al ejercicio exitosamente',
            'data' => $relacion,
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', EjercicioGrupoMuscular::class);
        $relacion = EjercicioGrupoMuscular::findOrFail($id);
        $relacion->delete();

        return response()->json([
            'message' => 'Asignación eliminada exitosamente',
        ]);
    }
}
