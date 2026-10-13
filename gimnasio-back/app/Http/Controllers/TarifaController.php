<?php

namespace App\Http\Controllers;

use App\Actions\PlanTarifa\CreateTarifaAction;
use App\Actions\PlanTarifa\DeleteTarifaAction;
use App\Actions\PlanTarifa\ListarTarifasAction;
use App\Actions\PlanTarifa\UpdateTarifaAction;
use App\DTOs\PlanTarifa\CreateTarifaDTO;
use App\DTOs\PlanTarifa\UpdateTarifaDTO;
use App\Http\Requests\PlanTarifa\CreateTarifaRequest;
use App\Http\Requests\PlanTarifa\UpdateTarifaRequest;
use App\Models\Tarifa;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TarifaController extends Controller
{
    public function index(ListarTarifasAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Tarifa::class);
        $tarifas = $action->execute();

        return response()->json([
            'message' => 'Tarifas listadas exitosamente',
            'data' => $tarifas,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', Tarifa::class);
        $tarifa = Tarifa::with('planes')->findOrFail($id);

        return response()->json([
            'message' => 'Detalle de tarifa obtenido exitosamente',
            'data' => $tarifa,
        ]);
    }

    public function store(CreateTarifaRequest $request, CreateTarifaAction $action): JsonResponse
    {
        Gate::authorize('create', Tarifa::class);
        $dto = CreateTarifaDTO::fromRequest($request);
        $tarifa = $action->execute($dto);

        return response()->json([
            'message' => 'Tarifa creada exitosamente',
            'data' => $tarifa,
        ], 201);
    }

    public function update(UpdateTarifaRequest $request, UpdateTarifaAction $action): JsonResponse
    {
        Gate::authorize('update', Tarifa::class);
        $dto = UpdateTarifaDTO::fromRequest($request);
        $tarifa = $action->execute($dto);

        return response()->json([
            'message' => 'Tarifa actualizada exitosamente',
            'data' => $tarifa,
        ]);
    }

    public function destroy(int $id, DeleteTarifaAction $action): JsonResponse
    {
        Gate::authorize('delete', Tarifa::class);
        $action->execute($id);

        return response()->json([
            'message' => 'Tarifa eliminada exitosamente',
        ]);
    }
}
