<?php

namespace App\Actions\Integracion;

use App\Models\TelegramVinculacionToken;
use Illuminate\Support\Facades\DB;

class VincularClienteTelegramAction
{
    /**
     * Procesa la vinculación del cliente a través del token enviado desde n8n/Telegram.
     *
     * @return array{
     *     success: bool,
     *     cliente_id?: int,
     *     nombre?: string,
     *     telegram_chat_id: string,
     *     mensaje: string
     * }
     */
    public function execute(string $token, string $telegramChatId, ?string $telegramUserId = null): array
    {
        $cleanToken = trim($token);
        $cleanChatId = trim($telegramChatId);
        $cleanUserId = $telegramUserId !== null ? trim($telegramUserId) : null;

        $tokenRecord = TelegramVinculacionToken::with('usuario')
            ->where('token', $cleanToken)
            ->first();

        if (!$tokenRecord) {
            return [
                'success' => false,
                'telegram_chat_id' => $cleanChatId,
                'mensaje' => 'El token de vinculación no existe o es incorrecto.',
            ];
        }

        if ($tokenRecord->isUsed()) {
            return [
                'success' => false,
                'telegram_chat_id' => $cleanChatId,
                'mensaje' => 'Este código de vinculación ya ha sido utilizado previamente.',
            ];
        }

        if ($tokenRecord->isExpired()) {
            return [
                'success' => false,
                'telegram_chat_id' => $cleanChatId,
                'mensaje' => 'El token de vinculación ha expirado. Por favor, genera un nuevo código desde la plataforma.',
            ];
        }

        $usuario = $tokenRecord->usuario;
        if (!$usuario || !$usuario->estado) {
            return [
                'success' => false,
                'telegram_chat_id' => $cleanChatId,
                'mensaje' => 'La cuenta de usuario asociada no existe o se encuentra inactiva.',
            ];
        }

        DB::transaction(function () use ($usuario, $tokenRecord, $cleanChatId, $cleanUserId) {
            $usuario->telegram_chat_id = $cleanChatId;
            $usuario->save();

            $tokenRecord->used_at = now();
            $tokenRecord->telegram_chat_id = $cleanChatId;
            $tokenRecord->telegram_user_id = $cleanUserId;
            $tokenRecord->save();
        });

        return [
            'success' => true,
            'cliente_id' => $usuario->id,
            'nombre' => $usuario->nombre,
            'telegram_chat_id' => (string) $cleanChatId,
            'mensaje' => 'Cuenta vinculada correctamente',
        ];
    }
}

