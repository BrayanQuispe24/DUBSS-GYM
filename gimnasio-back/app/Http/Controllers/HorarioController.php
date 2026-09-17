<?php

namespace App\Http\Controllers;

use App\Actions\Deporte\CreateHorarioAction;
use App\Actions\Deporte\DeleteHorarioAction;
use App\Actions\Deporte\ListarHorariosAction;
use App\Actions\Deporte\UpdateHorarioAction;
use App\DTOs\Deporte\CreateHorarioDTO;
use App\DTOs\Deporte\UpdateHorarioDTO;
use App\Http\Requests\Deporte\CreateHorarioRequest;
use App\Http\Requests\Deporte\UpdateHorarioRequest;
use App\Models\Horario;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class HorarioController extends Controller
{
    public function index(ListarHorariosAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Horario::class);
        $horarios = $action->execute();
        return response()->json([
            'message' => 'Horarios listados exitosamente',
            'data' => $horarios,
        ]);
    }

    public function store(CreateHorarioRequest $request, CreateHorarioAction $action): JsonResponse
    {
        Gate::authorize('create', Horario::class);
        $dto = CreateHorarioDTO::fromRequest($request);
        $horario = $action->execute($dto);
        return response()->json([
            'message' => 'Horario creado exitosamente',
            'data' => $horario,
        ], 201);
    }

    public function update(UpdateHorarioRequest $request, UpdateHorarioAction $action): JsonResponse
    {
        Gate::authorize('update', Horario::class);
        $dto = UpdateHorarioDTO::fromRequest($request);
        $horario = $action->execute($dto);
        return response()->json([
            'message' => 'Horario actualizado exitosamente',
            'data' => $horario,
        ]);
    }

    public function destroy(int $id, DeleteHorarioAction $action): JsonResponse
    {
        Gate::authorize('delete', Horario::class);
        $action->execute($id);
        return response()->json([
            'message' => 'Horario eliminado exitosamente',
        ]);
    }
}
