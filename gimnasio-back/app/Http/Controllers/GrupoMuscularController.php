<?php

namespace App\Http\Controllers;

use App\Actions\Entrenamiento\CreateGrupoMuscularAction;
use App\Actions\Entrenamiento\ListarGruposMuscularesAction;
use App\DTOs\Entrenamiento\CreateGrupoMuscularDTO;
use App\Http\Requests\Entrenamiento\CreateGrupoMuscularRequest;
use App\Models\GrupoMuscular;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class GrupoMuscularController extends Controller
{
    public function index(ListarGruposMuscularesAction $action): JsonResponse
    {
        Gate::authorize('viewAny', GrupoMuscular::class);
        $grupos = $action->execute();

        return response()->json([
            'message' => 'Grupos musculares listados exitosamente',
            'data' => $grupos,
        ]);
    }

    public function store(CreateGrupoMuscularRequest $request, CreateGrupoMuscularAction $action): JsonResponse
    {
        Gate::authorize('create', GrupoMuscular::class);
        $dto = CreateGrupoMuscularDTO::fromRequest($request);
        $grupo = $action->execute($dto);

        return response()->json([
            'message' => 'Grupo muscular creado exitosamente',
            'data' => $grupo,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', GrupoMuscular::class);
        $grupo = GrupoMuscular::findOrFail($id);

        return response()->json([
            'message' => 'Detalle del grupo muscular obtenido exitosamente',
            'data' => $grupo,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', GrupoMuscular::class);
        $grupo = GrupoMuscular::findOrFail($id);
        $grupo->delete();

        return response()->json([
            'message' => 'Grupo muscular eliminado exitosamente',
        ]);
    }
}
