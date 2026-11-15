<?php

namespace App\Http\Controllers;

use App\Actions\Integracion\RegistrarNotificacionAction;
use App\Http\Requests\Integracion\RegistrarNotificacionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IntegracionNotificacionController extends Controller
{
    public function registrar(RegistrarNotificacionRequest $request, RegistrarNotificacionAction $action): JsonResponse
    {
        $this->authorizeN8nOrStaff($request);

        $resultado = $action->execute($request->validated());
        $notificacion = $resultado['notificacion'];
        $yaExistia = $resultado['ya_existia'];

        $data = [
            'success' => true,
            'mensaje' => $yaExistia ? 'Notificación previamente registrada (idempotente)' : 'Notificación registrada exitosamente',
            'data' => [
                'id' => $notificacion->id,
                'boleta_id' => $notificacion->id_boleta_inscripcion,
                'cliente_id' => $notificacion->id_usuario,
                'fecha_vencimiento' => $notificacion->fecha_vencimiento?->format('Y-m-d') ?? (string) $notificacion->fecha_vencimiento,
                'dias_restantes' => $notificacion->dias_restantes,
                'canal' => $notificacion->canal,
                'estado' => $notificacion->estado,
                'telegram_message_id' => $notificacion->telegram_message_id,
                'fecha_envio' => $notificacion->fecha_envio?->format('Y-m-d H:i:s'),
            ],
        ];

        $response = response()->json($data, $yaExistia ? 200 : 201, [
            'Connection' => 'close',
        ]);
        $response->setEncodingOptions(JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $response->headers->set('Content-Length', (string) strlen($response->getContent()));

        return $response;
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
            return;
        }

        abort(401, 'No autorizado para acceder a este recurso. Proporcione un X-API-KEY válido o autenticación Sanctum.');
    }
}
