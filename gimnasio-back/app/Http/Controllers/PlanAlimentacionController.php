<?php

namespace App\Http\Controllers;

use App\Actions\Nutricion\CreatePlanAlimentacionAction;
use App\Actions\Nutricion\ListarPlanesAlimentacionAction;
use App\DTOs\Nutricion\CreatePlanAlimentacionDTO;
use App\Http\Requests\Nutricion\CreatePlanAlimentacionRequest;
use App\Models\PlanAlimentacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class PlanAlimentacionController extends Controller
{
    public function index(ListarPlanesAlimentacionAction $action): JsonResponse
    {
        Gate::authorize('viewAny', PlanAlimentacion::class);
        $planes = $action->execute();

        return response()->json([
            'message' => 'Planes de alimentación listados exitosamente',
            'data' => $planes,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', PlanAlimentacion::class);
        $plan = PlanAlimentacion::with(['usuario', 'detalles'])->findOrFail($id);

        return response()->json([
            'message' => 'Detalle del plan de alimentación obtenido exitosamente',
            'data' => $plan,
        ]);
    }

    public function store(CreatePlanAlimentacionRequest $request, CreatePlanAlimentacionAction $action): JsonResponse
    {
        Gate::authorize('create', PlanAlimentacion::class);
        $dto = CreatePlanAlimentacionDTO::fromRequest($request);
        $plan = $action->execute($dto);

        return response()->json([
            'message' => 'Plan de alimentación creado exitosamente',
            'data' => $plan,
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', PlanAlimentacion::class);
        $plan = PlanAlimentacion::findOrFail($id);
        $plan->delete();

        return response()->json([
            'message' => 'Plan de alimentación eliminado exitosamente',
        ]);
    }
}
