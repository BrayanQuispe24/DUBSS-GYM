<?php

namespace App\DTOs\Acceso;

use App\Http\Requests\Acceso\CreateRegistroEntradaSalidaRequest;

readonly class CreateRegistroEntradaSalidaDTO
{
    public function __construct(
        public string $tipo,
        public int $idUsuario,
        public ?int $idBoletaInscripcion = null,
        public ?string $fechaHora = null,
    ) {}

    public static function fromRequest(CreateRegistroEntradaSalidaRequest $request): self
    {
        return new self(
            tipo: $request->validated('tipo'),
            idUsuario: (int) $request->validated('id_usuario'),
            idBoletaInscripcion: $request->validated('id_boleta_inscripcion') ? (int) $request->validated('id_boleta_inscripcion') : null,
            fechaHora: $request->validated('fecha_hora'),
        );
    }
}
