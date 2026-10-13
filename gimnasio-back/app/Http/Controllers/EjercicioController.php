<?php

namespace App\Http\Controllers;

use App\Actions\Entrenamiento\CreateEjercicioAction;
use App\Actions\Entrenamiento\ListarEjerciciosAction;
use App\Actions\Entrenamiento\UpdateEjercicioAction;
use App\DTOs\Entrenamiento\CreateEjercicioDTO;
use App\Http\Requests\Entrenamiento\CreateEjercicioRequest;
use App\Http\Requests\Entrenamiento\UpdateEjercicioRequest;
use App\Models\Ejercicio;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class EjercicioController extends Controller
{
    public function index(Request $request, ListarEjerciciosAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Ejercicio::class);
        $filters = $request->only(['search', 'id_tipo_ejercicio', 'id_grupo_muscular', 'per_page', 'page', 'all']);
        $result = $action->execute($filters);

        if ($result instanceof LengthAwarePaginator) {
            return response()->json([
                'message' => 'Ejercicios listados exitosamente',
                'data' => $result->items(),
                'meta' => [
                    'current_page' => $result->currentPage(),
                    'last_page' => $result->lastPage(),
                    'per_page' => $result->perPage(),
                    'total' => $result->total(),
                ],
            ]);
        }

        return response()->json([
            'message' => 'Ejercicios listados exitosamente',
            'data' => $result,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', Ejercicio::class);
        $ejercicio = Ejercicio::with(['tipoEjercicio', 'ejercicioGrupoMusculares.grupoMuscular', 'imagenes'])->findOrFail($id);

        return response()->json([
            'message' => 'Detalle del ejercicio obtenido exitosamente',
            'data' => $ejercicio,
        ]);
    }

    public function store(CreateEjercicioRequest $request, CreateEjercicioAction $action): JsonResponse
    {
        Gate::authorize('create', Ejercicio::class);
        $dto = CreateEjercicioDTO::fromRequest($request);
        $ejercicio = $action->execute($dto);

        return response()->json([
            'message' => 'Ejercicio creado exitosamente',
            'data' => $ejercicio,
        ], 201);
    }

    public function update(int $id, UpdateEjercicioRequest $request, UpdateEjercicioAction $action): JsonResponse
    {
        Gate::authorize('update', Ejercicio::class);
        $ejercicio = Ejercicio::findOrFail($id);
        $updatedEjercicio = $action->execute($ejercicio, $request->validated());

        return response()->json([
            'message' => 'Ejercicio actualizado exitosamente',
            'data' => $updatedEjercicio,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', Ejercicio::class);
        $ejercicio = Ejercicio::findOrFail($id);
        $ejercicio->delete();

        return response()->json([
            'message' => 'Ejercicio eliminado exitosamente',
        ]);
    }
}
