<?php

namespace App\Http\Controllers;

use App\Actions\Publico\ObtenerResumenLandingAction;
use Illuminate\Http\JsonResponse;

class PublicLandingController extends Controller
{
    public function index(ObtenerResumenLandingAction $action): JsonResponse
    {
        return response()->json([
            'message' => 'Datos públicos de la landing obtenidos exitosamente',
            'data' => $action->execute(),
        ]);
    }
}
