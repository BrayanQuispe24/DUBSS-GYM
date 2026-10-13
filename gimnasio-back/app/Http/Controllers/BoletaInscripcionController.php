<?php

namespace App\Http\Controllers;

use App\Actions\Tramite\CreateBoletaInscripcionAction;
use App\Actions\Tramite\GenerarQRCodeBoletaInscripcionAction;
use App\Actions\Tramite\ListarBoletasInscripcionAction;
use App\DTOs\Tramite\CreateBoletaInscripcionDTO;
use App\Http\Requests\Tramite\CreateBoletaInscripcionRequest;
use App\Models\BoletaInscripcion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class BoletaInscripcionController extends Controller
{
    public function index(Request $request, ListarBoletasInscripcionAction $action): JsonResponse
    {
        Gate::authorize('viewAny', BoletaInscripcion::class);
        $boletas = $action->execute($request->user());

        return response()->json([
            'message' => 'Boletas de inscripción listadas exitosamente',
            'data' => $boletas,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', BoletaInscripcion::class);
        $boleta = BoletaInscripcion::with(['usuario', 'tarifa', 'registrosEntradaSalida'])->findOrFail($id);

        return response()->json([
            'message' => 'Detalle de la boleta de inscripción obtenido exitosamente',
            'data' => $boleta,
        ]);
    }

    public function generarQR(int $id, GenerarQRCodeBoletaInscripcionAction $action): JsonResponse
    {
        Gate::authorize('view', BoletaInscripcion::class);
        $qrData = $action->execute($id);

        return response()->json([
            'message' => 'Código QR de inscripción generado exitosamente',
            'data' => $qrData,
        ]);
    }

    public function store(CreateBoletaInscripcionRequest $request, CreateBoletaInscripcionAction $action): JsonResponse
    {
        Gate::authorize('create', BoletaInscripcion::class);
        $dto = CreateBoletaInscripcionDTO::fromRequest($request);
        $boleta = $action->execute($dto);

        return response()->json([
            'message' => 'Boleta de inscripción creada exitosamente',
            'data' => $boleta,
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', BoletaInscripcion::class);
        $boleta = BoletaInscripcion::findOrFail($id);
        $boleta->delete();

        return response()->json([
            'message' => 'Boleta de inscripción eliminada exitosamente',
        ]);
    }
}
