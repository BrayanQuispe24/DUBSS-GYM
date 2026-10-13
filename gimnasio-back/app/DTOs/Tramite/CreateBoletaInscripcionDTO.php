<?php

namespace App\DTOs\Tramite;

use App\Http\Requests\Tramite\CreateBoletaInscripcionRequest;

readonly class CreateBoletaInscripcionDTO
{
    public function __construct(
        public string $numeroBoleta,
        public float $monto,
        public int $idUsuario,
        public ?int $idTarifa = null,
        public ?string $fechaInscripcion = null,
        public ?string $fechaInicio = null,
        public ?string $fechaFin = null,
        public string $estado = 'activo',
        public ?string $disciplina = null,
        public ?string $horaInicio = null,
        public ?string $horaSalida = null,
        public ?int $idDisciplinaHorario = null,
        public ?int $idDisciplina = null,
    ) {}

    public static function fromRequest(CreateBoletaInscripcionRequest $request): self
    {
        return new self(
            numeroBoleta: $request->validated('numero_boleta'),
            monto: (float) $request->validated('monto'),
            idUsuario: (int) $request->validated('id_usuario'),
            idTarifa: $request->validated('id_tarifa') ? (int) $request->validated('id_tarifa') : null,
            fechaInscripcion: $request->validated('fecha_inscripcion'),
            fechaInicio: $request->validated('fecha_inicio'),
            fechaFin: $request->validated('fecha_fin'),
            estado: $request->validated('estado', 'activo'),
            disciplina: $request->validated('disciplina'),
            horaInicio: $request->validated('hora_inicio'),
            horaSalida: $request->validated('hora_salida'),
            idDisciplinaHorario: $request->validated('id_disciplina_horario') ? (int) $request->validated('id_disciplina_horario') : null,
            idDisciplina: $request->validated('id_disciplina') ? (int) $request->validated('id_disciplina') : null,
        );
    }
}
