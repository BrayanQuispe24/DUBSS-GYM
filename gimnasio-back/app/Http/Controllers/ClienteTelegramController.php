<?php

namespace App\Http\Controllers;

use App\Actions\Integracion\DesvincularClienteTelegramAction;
use App\Actions\Integracion\GenerarTokenTelegramAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClienteTelegramController extends Controller
{
    /**
     * Devuelve el estado actual de vinculación con Telegram del cliente autenticado.
     */
    public function estado(Request $request): JsonResponse
    {
        $usuario = $request->user();

        $vinculado = !empty($usuario->telegram_chat_id);

        return response()->json([
            'success' => true,
            'vinculado' => $vinculado,
            'telegram_chat_id' => $usuario->telegram_chat_id,
            'mensaje' => $vinculado
                ? 'Cuenta vinculada con Telegram'
                : 'Cuenta no vinculada',
        ]);
    }

    /**
     * Genera un código temporal para vincular la cuenta en el bot de Telegram.
     */
    public function generarToken(Request $request, GenerarTokenTelegramAction $action): JsonResponse
    {
        $usuario = $request->user();

        $resultado = $action->execute($usuario, 15);

        return response()->json([
            'success' => true,
            'mensaje' => 'Código de vinculación generado. Tienes 15 minutos para enviarlo al bot de Telegram.',
            'data' => $resultado,
        ]);
    }

    /**
     * Desvincula la cuenta de Telegram del cliente autenticado.
     */
    public function desvincular(Request $request, DesvincularClienteTelegramAction $action): JsonResponse
    {
        $usuario = $request->user();

        $action->execute($usuario);

        return response()->json([
            'success' => true,
            'mensaje' => 'Cuenta de Telegram desvinculada exitosamente.',
        ]);
    }
}

