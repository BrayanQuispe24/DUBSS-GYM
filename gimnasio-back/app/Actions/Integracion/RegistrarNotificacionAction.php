<?php

namespace App\Actions\Integracion;

use App\Models\NotificacionMembresia;
use Carbon\Carbon;

class RegistrarNotificacionAction
{
    /**
     * Registrar o actualizar el estado de una notificación enviada desde n8n.
     *
     * @param array{
     *     boleta_id: int,
     *     cliente_id: int,
     *     fecha_vencimiento: string,
     *     dias_restantes: int,
     *     canal: string,
     *     estado: string,
     *     telegram_message_id?: string|int|null,
     *     error_motivo?: ?string
     * } $data
     * @return array{
     *     notificacion: NotificacionMembresia,
     *     ya_existia: bool
     * }
     */
    public function execute(array $data): array
    {
        $canal = mb_strtolower(trim($data['canal'] ?? 'telegram'));
        $estado = mb_strtolower(trim($data['estado'] ?? 'enviado'));
        $fechaVencimiento = Carbon::parse($data['fecha_vencimiento'])->toDateString();
        $diasRestantes = (int) ($data['dias_restantes'] ?? 0);
        $messageId = isset($data['telegram_message_id']) && $data['telegram_message_id'] !== ''
            ? (string) $data['telegram_message_id']
            : null;

        $criterioUnicidad = [
            'id_boleta_inscripcion' => (int) $data['boleta_id'],
            'fecha_vencimiento' => $fechaVencimiento,
            'dias_restantes' => $diasRestantes,
            'canal' => $canal,
        ];

        $existente = NotificacionMembresia::where($criterioUnicidad)->first();

        if ($existente) {
            // Si ya estaba enviado, mantenemos idempotencia sin duplicar
            if ($existente->estado === 'enviado' && $estado === 'enviado') {
                if ($messageId && !$existente->telegram_message_id) {
                    $existente->update(['telegram_message_id' => $messageId]);
                }

                return [
                    'notificacion' => $existente,
                    'ya_existia' => true,
                ];
            }

            // Si antes falló y ahora se envió con éxito, actualizamos
            $existente->update([
                'id_usuario' => (int) $data['cliente_id'],
                'estado' => $estado,
                'telegram_message_id' => $messageId ?? $existente->telegram_message_id,
                'error_motivo' => $data['error_motivo'] ?? ($estado === 'enviado' ? null : $existente->error_motivo),
                'fecha_envio' => now(),
            ]);

            return [
                'notificacion' => $existente,
                'ya_existia' => false,
            ];
        }

        $nueva = NotificacionMembresia::create([
            'id_boleta_inscripcion' => (int) $data['boleta_id'],
            'id_usuario' => (int) $data['cliente_id'],
            'fecha_vencimiento' => $fechaVencimiento,
            'dias_restantes' => $diasRestantes,
            'canal' => $canal,
            'estado' => $estado,
            'telegram_message_id' => $messageId,
            'error_motivo' => $data['error_motivo'] ?? null,
            'fecha_envio' => now(),
        ]);

        return [
            'notificacion' => $nueva,
            'ya_existia' => false,
        ];
    }
}

