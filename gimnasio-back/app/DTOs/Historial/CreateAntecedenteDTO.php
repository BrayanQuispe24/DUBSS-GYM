<?php

namespace App\DTOs\Historial;

use App\Http\Requests\Historial\CreateAntecedenteRequest;

readonly class CreateAntecedenteDTO
{
    public function __construct(
        public int $id_historial,
        public array $data
    ) {}

    public static function fromRequest(CreateAntecedenteRequest $request): self
    {
        return new self(
            id_historial: (int) $request->validated('id_historial'),
            data: $request->validated()
        );
    }
}
