<?php

namespace App\Http\Controllers;

use App\Actions\Deporte\CreateDisciplinaAction;
use App\Actions\Deporte\DeleteDisciplinaAction;
use App\Actions\Deporte\ListarDisciplinasAction;
use App\Actions\Deporte\UpdateDisciplinaAction;
use App\DTOs\Deporte\CreateDisciplinaDTO;
use App\DTOs\Deporte\UpdateDisciplinaDTO;
use App\Http\Requests\Deporte\CreateDisciplinaRequest;
use App\Http\Requests\Deporte\UpdateDisciplinaRequest;
use App\Models\Disciplina;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class DisciplinaController extends Controller
{
    public function index(ListarDisciplinasAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Disciplina::class);
        $disciplinas = $action->execute();
        return response()->json([
            'message' => 'Disciplinas listadas exitosamente',
            'data' => $disciplinas,
        ]);
    }

    public function store(CreateDisciplinaRequest $request, CreateDisciplinaAction $action): JsonResponse
    {
        Gate::authorize('create', Disciplina::class);
        $dto = CreateDisciplinaDTO::fromRequest($request);
        $disciplina = $action->execute($dto);
        return response()->json([
            'message' => 'Disciplina creada exitosamente',
            'data' => $disciplina,
        ], 201);
    }

    public function update(UpdateDisciplinaRequest $request, UpdateDisciplinaAction $action): JsonResponse
    {
        Gate::authorize('update', Disciplina::class);
        $dto = UpdateDisciplinaDTO::fromRequest($request);
        $disciplina = $action->execute($dto);
        return response()->json([
            'message' => 'Disciplina actualizada exitosamente',
            'data' => $disciplina,
        ]);
    }

    public function destroy(int $id, DeleteDisciplinaAction $action): JsonResponse
    {
        Gate::authorize('delete', Disciplina::class);
        $action->execute($id);
        return response()->json([
            'message' => 'Disciplina eliminada exitosamente',
        ]);
    }
}
