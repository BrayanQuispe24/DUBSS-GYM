<?php

namespace App\DTOs\Deporte;

use App\Http\Requests\Deporte\UpdateDisciplinaRequest;

readonly class UpdateDisciplinaDTO
{
    public function __construct(
        public int $id,
        public string $nombre,
        public int $cantidad_cupos,
        public ?string $estado = 'activo'
    ) {}

    public static function fromRequest(UpdateDisciplinaRequest $request): self
    {
        $disciplinaParam = $request->route('disciplina') ?? $request->route('id') ?? $request->validated('id') ?? $request->input('id');
        $id = is_object($disciplinaParam) ? $disciplinaParam->id : (int) $disciplinaParam;

        return new self(
            id: (int) $id,
            nombre: $request->validated('nombre'),
            cantidad_cupos: (int) $request->validated('cantidad_cupos'),
            estado: $request->validated('estado') ?? 'activo'
        );
    }
}
