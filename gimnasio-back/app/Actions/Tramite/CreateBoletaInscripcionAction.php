<?php

namespace App\Actions\Tramite;

use App\DTOs\Tramite\CreateBoletaInscripcionDTO;
use App\Models\BoletaInscripcion;

class CreateBoletaInscripcionAction
{
    public function execute(CreateBoletaInscripcionDTO $dto): BoletaInscripcion
    {
        $boleta = BoletaInscripcion::create([
            'numero_boleta' => $dto->numeroBoleta,
            'monto' => $dto->monto,
            'id_usuario' => $dto->idUsuario,
            'id_tarifa' => $dto->idTarifa,
            'fecha_inscripcion' => $dto->fechaInscripcion ?? now(),
            'fecha_inicio' => $dto->fechaInicio,
            'fecha_fin' => $dto->fechaFin,
            'estado' => $dto->estado,
            'disciplina' => $dto->disciplina,
            'hora_inicio' => $dto->horaInicio,
            'hora_salida' => $dto->horaSalida,
            'id_disciplina_horario' => $dto->idDisciplinaHorario,
            'id_disciplina' => $dto->idDisciplina,
        ]);

        return $boleta->load(['usuario', 'tarifa']);
    }
}
