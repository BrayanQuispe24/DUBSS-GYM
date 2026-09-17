<?php

namespace App\DTOs\Deporte;

use App\Http\Requests\Deporte\AsignarDisciplinaHorarioRequest;

readonly class AsignarDisciplinaHorarioDTO
{
    public function __construct(
        public int $id_disciplina,
        public int $id_horario,
        public int $cupo_maximo,
        public bool $estado = true
    ) {}

    public static function fromRequest(AsignarDisciplinaHorarioRequest $request): self
    {
        return new self(
            id_disciplina: (int) $request->validated('id_disciplina'),
            id_horario: (int) $request->validated('id_horario'),
            cupo_maximo: (int) $request->validated('cupo_maximo'),
            estado: $request->validated('estado') ?? true
        );
    }
}
