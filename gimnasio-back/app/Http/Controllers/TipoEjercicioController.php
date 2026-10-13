<?php

namespace App\Http\Controllers;

use App\Actions\Entrenamiento\CreateTipoEjercicioAction;
use App\Actions\Entrenamiento\ListarTiposEjercicioAction;
use App\DTOs\Entrenamiento\CreateTipoEjercicioDTO;
use App\Http\Requests\Entrenamiento\CreateTipoEjercicioRequest;
use App\Models\TipoEjercicio;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TipoEjercicioController extends Controller
{
    public function index(ListarTiposEjercicioAction $action): JsonResponse
    {
        Gate::authorize('viewAny', TipoEjercicio::class);
        $tipos = $action->execute();

        return response()->json([
            'message' => 'Tipos de ejercicio listados exitosamente',
            'data' => $tipos,
        ]);
    }

    public function store(CreateTipoEjercicioRequest $request, CreateTipoEjercicioAction $action): JsonResponse
    {
        Gate::authorize('create', TipoEjercicio::class);
        $dto = CreateTipoEjercicioDTO::fromRequest($request);
        $tipo = $action->execute($dto);

        return response()->json([
            'message' => 'Tipo de ejercicio creado exitosamente',
            'data' => $tipo,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', TipoEjercicio::class);
        $tipo = TipoEjercicio::findOrFail($id);

        return response()->json([
            'message' => 'Detalle del tipo de ejercicio obtenido exitosamente',
            'data' => $tipo,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', TipoEjercicio::class);
        $tipo = TipoEjercicio::findOrFail($id);
        $tipo->delete();

        return response()->json([
            'message' => 'Tipo de ejercicio eliminado exitosamente',
        ]);
    }
}
