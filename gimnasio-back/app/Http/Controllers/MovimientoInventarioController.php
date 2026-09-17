<?php

namespace App\Http\Controllers;

use App\Actions\Inventario\CreateMovimientoInventarioAction;
use App\Actions\Inventario\ListarMovimientosInventarioAction;
use App\DTOs\Inventario\CreateMovimientoInventarioDTO;
use App\Http\Requests\Inventario\CreateMovimientoInventarioRequest;
use App\Models\MovimientoInventario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MovimientoInventarioController extends Controller
{
    public function index(ListarMovimientosInventarioAction $action): JsonResponse
    {
        Gate::authorize('viewAny', MovimientoInventario::class);
        $movimientos = $action->execute();
        return response()->json([
            'message' => 'Movimientos de inventario listados exitosamente',
            'data' => $movimientos,
        ]);
    }

    public function store(CreateMovimientoInventarioRequest $request, CreateMovimientoInventarioAction $action): JsonResponse
    {
        Gate::authorize('create', MovimientoInventario::class);
        $dto = CreateMovimientoInventarioDTO::fromRequest($request);
        $movimiento = $action->execute($dto, $request->user());
        return response()->json([
            'message' => 'Movimiento de inventario registrado exitosamente',
            'data' => $movimiento,
        ], 201);
    }
}
