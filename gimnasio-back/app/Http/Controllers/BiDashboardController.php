<?php

namespace App\Http\Controllers;

use App\Actions\Bi\ExportarDatosBiAction;
use App\Actions\Bi\ListarDetalleBiAction;
use App\Actions\Bi\ObtenerDistribucionBiAction;
use App\Actions\Bi\ObtenerResumenBiAction;
use App\Actions\Bi\ObtenerSeriesBiAction;
use App\Http\Requests\Bi\BiFilterRequest;
use App\Services\Bi\BiQueryHelper;
use Illuminate\Http\JsonResponse;

class BiDashboardController extends Controller
{
    public function resumen(BiFilterRequest $request, ObtenerResumenBiAction $action): JsonResponse
    {
        return response()->json([
            'message' => 'Resumen BI obtenido exitosamente',
            'data' => $action->execute($request->normalizedFilters()),
        ]);
    }

    public function series(BiFilterRequest $request, ObtenerSeriesBiAction $action): JsonResponse
    {
        return response()->json([
            'message' => 'Series BI obtenidas exitosamente',
            'data' => $action->execute($request->normalizedFilters()),
        ]);
    }

    public function distribucion(BiFilterRequest $request, ObtenerDistribucionBiAction $action): JsonResponse
    {
        return response()->json([
            'message' => 'Distribución BI obtenida exitosamente',
            'data' => $action->execute($request->normalizedFilters()),
        ]);
    }

    public function aforoTiempoReal(BiFilterRequest $request, BiQueryHelper $helper): JsonResponse
    {
        $filters = $request->normalizedFilters();

        return response()->json([
            'message' => 'Aforo en tiempo real obtenido exitosamente',
            'data' => $helper->aforoTiempoReal($filters['id_disciplina']),
        ]);
    }

    public function movimientos(BiFilterRequest $request, ListarDetalleBiAction $action): JsonResponse
    {
        $result = $action->execute($request->normalizedFilters(), false);

        return response()->json([
            'message' => 'Movimientos BI listados exitosamente',
            'data' => $result['data'],
            'meta' => $result['meta'],
        ]);
    }

    public function exportarDatos(BiFilterRequest $request, ExportarDatosBiAction $action): JsonResponse
    {
        $user = $request->user();
        $generadoPor = $user ? $user->name : 'Sistema';

        return response()->json([
            'message' => 'Datos completos para exportación generados exitosamente',
            'data' => $action->execute($request->normalizedFilters(), $generadoPor),
        ]);
    }
}

