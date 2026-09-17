<?php

namespace App\DTOs\Deporte;

use App\Http\Requests\Deporte\UpdateHorarioRequest;

readonly class UpdateHorarioDTO
{
    public function __construct(
        public int $id,
        public string $hora_inicio,
        public string $hora_fin
    ) {}

    public static function fromRequest(UpdateHorarioRequest $request): self
    {
        return new self(
            id: (int) ($request->route('id') ?? $request->validated('id')),
            hora_inicio: (string) $request->validated('hora_inicio'),
            hora_fin: (string) $request->validated('hora_fin')
        );
    }
}
