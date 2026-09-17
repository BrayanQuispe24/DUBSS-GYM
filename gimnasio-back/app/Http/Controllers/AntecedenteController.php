<?php

namespace App\Http\Controllers;

use App\Actions\Historial\CreateAntecedenteAction;
use App\DTOs\Historial\CreateAntecedenteDTO;
use App\Http\Requests\Historial\CreateAntecedenteRequest;
use App\Models\Antecedente;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class AntecedenteController extends Controller
{
    public function store(CreateAntecedenteRequest $request, CreateAntecedenteAction $action): JsonResponse
    {
        Gate::authorize('create', Antecedente::class);
        $dto = CreateAntecedenteDTO::fromRequest($request);
        $antecedente = $action->execute($dto);
        return response()->json(['message' => 'Antecedente médico registrado exitosamente', 'data' => $antecedente], 201);
    }
}
