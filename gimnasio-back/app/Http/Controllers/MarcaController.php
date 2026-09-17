<?php

namespace App\Http\Controllers;

use App\Actions\Inventario\CreateMarcaAction;
use App\Actions\Inventario\DeleteMarcaAction;
use App\Actions\Inventario\ListarMarcasAction;
use App\Actions\Inventario\UpdateMarcaAction;
use App\DTOs\Inventario\CreateMarcaDTO;
use App\DTOs\Inventario\UpdateMarcaDTO;
use App\Http\Requests\Inventario\CreateMarcaRequest;
use App\Http\Requests\Inventario\UpdateMarcaRequest;
use App\Models\Marca;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class MarcaController extends Controller
{
    public function index(ListarMarcasAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Marca::class);
        $marcas = $action->execute();
        return response()->json(['data' => $marcas]);
    }

    public function store(CreateMarcaRequest $request, CreateMarcaAction $action): JsonResponse
    {
        Gate::authorize('create', Marca::class);
        $dto = CreateMarcaDTO::fromRequest($request);
        $marca = $action->execute($dto);
        return response()->json(['message' => 'Marca creada exitosamente', 'data' => $marca], 201);
    }

    public function show(Marca $marca): JsonResponse
    {
        Gate::authorize('view', $marca);
        return response()->json(['data' => $marca]);
    }

    public function update(UpdateMarcaRequest $request, Marca $marca, UpdateMarcaAction $action): JsonResponse
    {
        Gate::authorize('update', $marca);
        $dto = UpdateMarcaDTO::fromRequest($request);
        $updated = $action->execute($marca, $dto);
        return response()->json(['message' => 'Marca actualizada exitosamente', 'data' => $updated]);
    }

    public function destroy(Marca $marca, DeleteMarcaAction $action): JsonResponse
    {
        Gate::authorize('delete', $marca);
        $action->execute($marca);
        return response()->json(['message' => 'Marca eliminada exitosamente']);
    }
}
