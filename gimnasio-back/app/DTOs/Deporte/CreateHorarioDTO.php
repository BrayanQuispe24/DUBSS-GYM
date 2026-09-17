<?php

namespace App\DTOs\Deporte;

use App\Http\Requests\Deporte\CreateHorarioRequest;

readonly class CreateHorarioDTO
{
    public function __construct(
        public ?string $dia_semana,
        public string $hora_inicio,
        public string $hora_fin
    ) {}

    public static function fromRequest(CreateHorarioRequest $request): self
    {
        return new self(
            dia_semana: $request->validated('dia_semana'),
            hora_inicio: (string) $request->validated('hora_inicio'),
            hora_fin: (string) $request->validated('hora_fin')
        );
    }
}
