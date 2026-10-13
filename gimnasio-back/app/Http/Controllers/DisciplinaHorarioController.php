<?php

namespace App\Http\Controllers;

use App\Actions\Deporte\AsignarDisciplinaHorarioAction;
use App\DTOs\Deporte\AsignarDisciplinaHorarioDTO;
use App\Http\Requests\Deporte\AsignarDisciplinaHorarioRequest;
use App\Models\DisciplinaHorario;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class DisciplinaHorarioController extends Controller
{
    public function index(): JsonResponse
    {
        $disciplinaHorarios = DisciplinaHorario::with(['disciplina', 'horario'])->get();

        return response()->json([
            'message' => 'Lista de horarios por disciplina obtenidos exitosamente',
            'data' => $disciplinaHorarios,
        ]);
    }

    public function store(AsignarDisciplinaHorarioRequest $request, AsignarDisciplinaHorarioAction $action): JsonResponse
    {
        Gate::authorize('create', DisciplinaHorario::class);
        $dto = AsignarDisciplinaHorarioDTO::fromRequest($request);
        $disciplinaHorario = $action->execute($dto);

        return response()->json([
            'message' => 'Horario asignado a la disciplina exitosamente',
            'data' => $disciplinaHorario,
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', DisciplinaHorario::class);
        $dh = DisciplinaHorario::findOrFail($id);
        $dh->delete();

        return response()->json([
            'message' => 'Asignación de horario eliminada exitosamente',
        ]);
    }
}
