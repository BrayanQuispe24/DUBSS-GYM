<?php

namespace App\Http\Controllers;

use App\Actions\Acceso\CreateRegistroEntradaSalidaAction;
use App\Actions\Acceso\ListarRegistrosEntradaSalidaAction;
use App\Actions\Acceso\ValidarAccesoQRAction;
use App\DTOs\Acceso\CreateRegistroEntradaSalidaDTO;
use App\Http\Requests\Acceso\CreateRegistroEntradaSalidaRequest;
use App\Models\RegistroEntradaSalida;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RegistroEntradaSalidaController extends Controller
{
    public function index(ListarRegistrosEntradaSalidaAction $action): JsonResponse
    {
        Gate::authorize('viewAny', RegistroEntradaSalida::class);
        $registros = $action->execute();

        return response()->json([
            'message' => 'Registros de entrada y salida listados exitosamente',
            'data' => $registros,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', RegistroEntradaSalida::class);
        $registro = RegistroEntradaSalida::with(['usuario', 'boletaInscripcion'])->findOrFail($id);

        return response()->json([
            'message' => 'Detalle del registro de acceso obtenido exitosamente',
            'data' => $registro,
        ]);
    }

    public function validarQR(Request $request, ValidarAccesoQRAction $action): JsonResponse
    {
        Gate::authorize('create', RegistroEntradaSalida::class);

        $request->validate([
            'qr_payload' => 'required',
            'tipo' => 'nullable|string',
        ]);

        $tipo = $request->input('tipo', 'auto');
        $result = $action->execute($request->input('qr_payload'), $tipo);

        $status = $result['permitido'] ? 200 : 422;

        return response()->json($result, $status);
    }

    public function store(CreateRegistroEntradaSalidaRequest $request, CreateRegistroEntradaSalidaAction $action): JsonResponse
    {
        Gate::authorize('create', RegistroEntradaSalida::class);
        $dto = CreateRegistroEntradaSalidaDTO::fromRequest($request);
        $registro = $action->execute($dto);

        return response()->json([
            'message' => 'Registro de acceso guardado exitosamente',
            'data' => $registro,
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', RegistroEntradaSalida::class);
        $registro = RegistroEntradaSalida::findOrFail($id);
        $registro->delete();

        return response()->json([
            'message' => 'Registro de acceso eliminado exitosamente',
        ]);
    }
}
