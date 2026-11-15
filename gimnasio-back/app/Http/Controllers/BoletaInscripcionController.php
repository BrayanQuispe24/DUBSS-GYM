<?php

namespace App\Http\Controllers;

use App\Actions\Tramite\CreateBoletaInscripcionAction;
use App\Actions\Tramite\GenerarQRCodeBoletaInscripcionAction;
use App\Actions\Tramite\ListarBoletasInscripcionAction;
use App\Actions\Tramite\ListarMembresiasVencimientoAction;
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

    public function vencimientos(Request $request, ListarMembresiasVencimientoAction $action): \Symfony\Component\HttpFoundation\Response
    {
        $this->authorizeN8nOrStaff($request);

        $membresias = $action->execute($request->all());

        $payload = json_encode([
            'membresias' => $membresias,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return response($payload, 200, [
            'Content-Type' => 'application/json',
            'Content-Length' => (string) strlen($payload),
            'Connection' => 'close',
        ]);
    }

    private function authorizeN8nOrStaff(Request $request): void
    {
        $configuredApiKey = config('services.n8n.api_key');
        $providedApiKey = $request->header('X-API-KEY')
            ?? $request->header('x-api-key')
            ?? $request->query('api_key');

        if (!empty($configuredApiKey) && !empty($providedApiKey) && hash_equals((string) $configuredApiKey, (string) $providedApiKey)) {
            return;
        }

        $user = $request->user('sanctum') ?? $request->user();
        if ($user) {
            Gate::forUser($user)->authorize('viewAny', BoletaInscripcion::class);
            return;
        }

        abort(401, 'No autorizado para acceder a este recurso. Proporcione un X-API-KEY válido o autenticación Sanctum.');
    }
}
