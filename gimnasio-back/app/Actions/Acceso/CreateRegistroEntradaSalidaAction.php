<?php

namespace App\Actions\Acceso;

use App\DTOs\Acceso\CreateRegistroEntradaSalidaDTO;
use App\Models\RegistroEntradaSalida;

class CreateRegistroEntradaSalidaAction
{
    public function execute(CreateRegistroEntradaSalidaDTO $dto): RegistroEntradaSalida
    {
        $registro = RegistroEntradaSalida::create([
            'tipo' => $dto->tipo,
            'id_usuario' => $dto->idUsuario,
            'id_boleta_inscripcion' => $dto->idBoletaInscripcion,
            'fecha_hora' => $dto->fechaHora ?? now(),
        ]);

        return $registro->load(['usuario', 'boletaInscripcion']);
    }
}
