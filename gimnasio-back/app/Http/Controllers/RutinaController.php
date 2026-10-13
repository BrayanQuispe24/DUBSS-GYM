<?php

namespace App\Http\Controllers;

use App\Actions\Entrenamiento\CreateRutinaAction;
use App\Actions\Entrenamiento\ListarRutinasAction;
use App\Actions\Entrenamiento\UpdateRutinaAction;
use App\DTOs\Entrenamiento\CreateRutinaDTO;
use App\Http\Requests\Entrenamiento\CreateRutinaRequest;
use App\Http\Requests\Entrenamiento\UpdateRutinaRequest;
use App\Models\Rutina;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class RutinaController extends Controller
{
    public function index(ListarRutinasAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Rutina::class);
        $rutinas = $action->execute();

        return response()->json([
            'message' => 'Rutinas listadas exitosamente',
            'data' => $rutinas,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', Rutina::class);
        $rutina = Rutina::with('rutinaEjercicios.ejercicio.tipoEjercicio')->findOrFail($id);

        return response()->json([
            'message' => 'Detalle de la rutina obtenido exitosamente',
            'data' => $rutina,
        ]);
    }

    public function store(CreateRutinaRequest $request, CreateRutinaAction $action): JsonResponse
    {
        Gate::authorize('create', Rutina::class);
        $dto = CreateRutinaDTO::fromRequest($request);
        $rutina = $action->execute($dto);

        return response()->json([
            'message' => 'Rutina creada exitosamente',
            'data' => $rutina,
        ], 201);
    }

    public function update(int $id, UpdateRutinaRequest $request, UpdateRutinaAction $action): JsonResponse
    {
        Gate::authorize('update', Rutina::class);
        $rutina = Rutina::findOrFail($id);
        $updatedRutina = $action->execute($rutina, $request->validated());

        return response()->json([
            'message' => 'Rutina actualizada exitosamente',
            'data' => $updatedRutina,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', Rutina::class);
        $rutina = Rutina::findOrFail($id);
        $rutina->delete();

        return response()->json([
            'message' => 'Rutina eliminada exitosamente',
        ]);
    }
}
