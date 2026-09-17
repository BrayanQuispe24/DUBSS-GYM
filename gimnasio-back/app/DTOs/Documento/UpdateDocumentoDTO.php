<?php

namespace App\DTOs\Documento;

use App\Http\Requests\Documento\UpdateDocumentoRequest;
use Illuminate\Http\UploadedFile;

readonly class UpdateDocumentoDTO
{
    public function __construct(
        public int $id,
        public ?int $id_tipo_documento = null,
        public ?UploadedFile $archivo = null
    ) {}

    public static function fromRequest(UpdateDocumentoRequest $request): self
    {
        return new self(
            id: (int) ($request->route('id') ?? $request->validated('id')),
            id_tipo_documento: $request->validated('id_tipo_documento') ? (int) $request->validated('id_tipo_documento') : null,
            archivo: $request->file('archivo')
        );
    }
}
