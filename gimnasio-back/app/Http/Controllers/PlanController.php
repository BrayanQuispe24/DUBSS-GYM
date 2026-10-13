<?php

namespace App\Http\Controllers;

use App\Actions\PlanTarifa\CreatePlanAction;
use App\Actions\PlanTarifa\DeletePlanAction;
use App\Actions\PlanTarifa\ListarPlanesAction;
use App\Actions\PlanTarifa\UpdatePlanAction;
use App\DTOs\PlanTarifa\CreatePlanDTO;
use App\DTOs\PlanTarifa\UpdatePlanDTO;
use App\Http\Requests\PlanTarifa\CreatePlanRequest;
use App\Http\Requests\PlanTarifa\UpdatePlanRequest;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class PlanController extends Controller
{
    public function index(ListarPlanesAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Plan::class);
        $planes = $action->execute();

        return response()->json([
            'message' => 'Planes listados exitosamente',
            'data' => $planes,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', Plan::class);
        $plan = Plan::with('tarifa')->findOrFail($id);

        return response()->json([
            'message' => 'Detalle del plan obtenido exitosamente',
            'data' => $plan,
        ]);
    }

    public function store(CreatePlanRequest $request, CreatePlanAction $action): JsonResponse
    {
        Gate::authorize('create', Plan::class);
        $dto = CreatePlanDTO::fromRequest($request);
        $plan = $action->execute($dto);

        return response()->json([
            'message' => 'Plan creado exitosamente',
            'data' => $plan,
        ], 201);
    }

    public function update(UpdatePlanRequest $request, UpdatePlanAction $action): JsonResponse
    {
        Gate::authorize('update', Plan::class);
        $dto = UpdatePlanDTO::fromRequest($request);
        $plan = $action->execute($dto);

        return response()->json([
            'message' => 'Plan actualizado exitosamente',
            'data' => $plan,
        ]);
    }

    public function destroy(int $id, DeletePlanAction $action): JsonResponse
    {
        Gate::authorize('delete', Plan::class);
        $action->execute($id);

        return response()->json([
            'message' => 'Plan eliminado exitosamente',
        ]);
    }
}
