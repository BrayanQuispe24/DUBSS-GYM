<?php

namespace App\Http\Controllers;

use App\Actions\Entrenamiento\CreatePlanEntrenamientoAction;
use App\Actions\Entrenamiento\ListarPlanesEntrenamientoAction;
use App\Actions\Entrenamiento\UpdatePlanEntrenamientoAction;
use App\DTOs\Entrenamiento\CreatePlanEntrenamientoDTO;
use App\Http\Requests\Entrenamiento\CreatePlanEntrenamientoRequest;
use App\Http\Requests\Entrenamiento\UpdatePlanEntrenamientoRequest;
use App\Models\PlanEntrenamiento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PlanEntrenamientoController extends Controller
{
    public function index(Request $request, ListarPlanesEntrenamientoAction $action): JsonResponse
    {
        Gate::authorize('viewAny', PlanEntrenamiento::class);
        $planes = $action->execute($request->user());

        return response()->json([
            'message' => 'Planes de entrenamiento listados exitosamente',
            'data' => $planes,
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $plan = PlanEntrenamiento::with([
            'usuario',
            'planEntrenamientoRutinas.rutina.rutinaEjercicios.ejercicio.tipoEjercicio',
            'planEntrenamientoRutinas.rutina.rutinaEjercicios.ejercicio.imagenes',
        ])->findOrFail($id);

        Gate::authorize('view', $plan);

        return response()->json([
            'message' => 'Detalle del plan de entrenamiento obtenido exitosamente',
            'data' => $plan,
        ]);
    }

    public function store(CreatePlanEntrenamientoRequest $request, CreatePlanEntrenamientoAction $action): JsonResponse
    {
        Gate::authorize('create', PlanEntrenamiento::class);
        $dto = CreatePlanEntrenamientoDTO::fromRequest($request);
        $plan = $action->execute($dto);

        return response()->json([
            'message' => 'Plan de entrenamiento creado exitosamente',
            'data' => $plan,
        ], 201);
    }

    public function update(int $id, UpdatePlanEntrenamientoRequest $request, UpdatePlanEntrenamientoAction $action): JsonResponse
    {
        Gate::authorize('update', PlanEntrenamiento::class);
        $plan = PlanEntrenamiento::findOrFail($id);
        $updatedPlan = $action->execute($plan, $request->validated());

        return response()->json([
            'message' => 'Plan de entrenamiento actualizado exitosamente',
            'data' => $updatedPlan,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', PlanEntrenamiento::class);
        $plan = PlanEntrenamiento::findOrFail($id);
        $plan->delete();

        return response()->json([
            'message' => 'Plan de entrenamiento eliminado exitosamente',
        ]);
    }
}
