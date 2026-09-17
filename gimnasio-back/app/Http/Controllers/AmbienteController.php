<?php

namespace App\Http\Controllers;

use App\Actions\Espacio\CreateAmbienteAction;
use App\Actions\Espacio\DeleteAmbienteAction;
use App\Actions\Espacio\ListarAmbientesAction;
use App\Actions\Espacio\UpdateAmbienteAction;
use App\DTOs\Espacio\CreateAmbienteDTO;
use App\DTOs\Espacio\UpdateAmbienteDTO;
use App\Http\Requests\Espacio\CreateAmbienteRequest;
use App\Http\Requests\Espacio\UpdateAmbienteRequest;
use App\Models\Ambiente;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class AmbienteController extends Controller
{
    public function index(ListarAmbientesAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Ambiente::class);
        $ambientes = $action->execute();
        return response()->json(['data' => $ambientes]);
    }

    public function store(CreateAmbienteRequest $request, CreateAmbienteAction $action): JsonResponse
    {
        Gate::authorize('create', Ambiente::class);
        $dto = CreateAmbienteDTO::fromRequest($request);
        $ambiente = $action->execute($dto);
        return response()->json(['message' => 'Ambiente creado exitosamente', 'data' => $ambiente], 201);
    }

    public function show(Ambiente $ambiente): JsonResponse
    {
        Gate::authorize('view', $ambiente);
        $ambiente->load('equipos');
        return response()->json(['data' => $ambiente]);
    }

    public function update(UpdateAmbienteRequest $request, Ambiente $ambiente, UpdateAmbienteAction $action): JsonResponse
    {
        Gate::authorize('update', $ambiente);
        $dto = UpdateAmbienteDTO::fromRequest($request);
        $updated = $action->execute($ambiente, $dto);
        return response()->json(['message' => 'Ambiente actualizado exitosamente', 'data' => $updated]);
    }

    public function destroy(Ambiente $ambiente, DeleteAmbienteAction $action): JsonResponse
    {
        Gate::authorize('delete', $ambiente);
        $action->execute($ambiente);
        return response()->json(['message' => 'Ambiente eliminado exitosamente']);
    }
}
