<?php

namespace App\Actions\Tramite;

use App\Models\BoletaInscripcion;

class GenerarQRCodeBoletaInscripcionAction
{
    public function execute(int $id): array
    {
        $boleta = BoletaInscripcion::with(['usuario', 'tarifa', 'disciplinaHorario.horario'])->findOrFail($id);

        $usuario = $boleta->usuario;
        $nombreUsuario = $usuario ? trim("{$usuario->nombre} {$usuario->apellido}") : 'Socio UAGRM';
        if (empty($nombreUsuario) && $usuario) {
            $nombreUsuario = $usuario->email;
        }

        $dias = $boleta->disciplinaHorario?->horario?->dia_semana;
        $horaInicio = $boleta->hora_inicio ? substr($boleta->hora_inicio, 0, 5) : '07:00';
        $horaSalida = $boleta->hora_salida ? substr($boleta->hora_salida, 0, 5) : '09:00';
        $horarioTexto = ($dias ? "{$dias} · " : '') . "{$horaInicio} - {$horaSalida}";

        $payloadData = [
            'boleta_id' => $boleta->id,
            'numero_boleta' => $boleta->numero_boleta,
            'id_usuario' => $boleta->id_usuario,
            'usuario_nombre' => $nombreUsuario,
            'ci' => $usuario->ci ?? null,
            'registro_universitario' => $usuario->registro_universitario ?? null,
            'disciplina' => $boleta->disciplina ?? 'Gimnasio Musculación',
            'dias' => $dias,
            'hora_inicio' => $horaInicio,
            'hora_salida' => $horaSalida,
            'fecha_inicio' => $boleta->fecha_inicio,
            'fecha_fin' => $boleta->fecha_fin,
            'estado' => strtolower($boleta->estado ?? 'activo'),
        ];

        $payloadJson = json_encode($payloadData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $appKey = config('app.key') ?? 'DUBSS_GYM_SECRET_KEY';
        $signature = hash_hmac('sha256', $payloadJson, $appKey);

        $qrData = array_merge($payloadData, [
            'signature' => $signature,
        ]);

        return [
            'boleta_id' => $boleta->id,
            'numero_boleta' => $boleta->numero_boleta,
            'usuario' => [
                'id' => $usuario->id ?? null,
                'nombre' => $nombreUsuario,
                'email' => $usuario->email ?? null,
                'ci' => $usuario->ci ?? null,
                'registro_universitario' => $usuario->registro_universitario ?? null,
            ],
            'membresia' => [
                'disciplina' => $boleta->disciplina ?? 'Gimnasio Musculación',
                'dias' => $dias,
                'horario_texto' => $horarioTexto,
                'hora_inicio' => $horaInicio,
                'hora_salida' => $horaSalida,
                'fecha_inicio' => $boleta->fecha_inicio,
                'fecha_fin' => $boleta->fecha_fin,
                'estado' => strtolower($boleta->estado ?? 'activo'),
                'monto' => (float) $boleta->monto,
            ],
            'qr_payload' => json_encode($qrData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'signature' => $signature,
        ];
    }
}
