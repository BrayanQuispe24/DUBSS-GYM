<?php

namespace App\Http\Controllers;

use App\Actions\Integracion\VincularClienteTelegramAction;
use App\Http\Requests\Integracion\VincularTelegramRequest;
use Illuminate\Http\JsonResponse;

class TelegramIntegracionController extends Controller
{
    /**
     * Endpoint para n8n (Nodo 04 - Vincular cliente API).
     * POST /api/integraciones/telegram/vincular
     */
    public function vincular(
        VincularTelegramRequest $request,
        VincularClienteTelegramAction $action
    ): JsonResponse {
        $this->authorizeN8nOrStaff($request);

        $resultado = $action->execute(
            token: (string) $request->validated('token'),
            telegramChatId: (string) $request->validated('telegram_chat_id'),
            telegramUserId: $request->validated('telegram_user_id') !== null
                ? (string) $request->validated('telegram_user_id')
                : null
        );

        $response = response()->json($resultado, 200, [
            'Connection' => 'close',
        ]);
        $response->setEncodingOptions(JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $response->headers->set('Content-Length', (string) strlen($response->getContent()));

        return $response;
    }

    private function authorizeN8nOrStaff($request): void
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
