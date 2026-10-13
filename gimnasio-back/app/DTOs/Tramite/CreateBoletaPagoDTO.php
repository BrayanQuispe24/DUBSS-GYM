<?php

namespace App\DTOs\Tramite;

use App\Http\Requests\Tramite\CreateBoletaPagoRequest;

readonly class CreateBoletaPagoDTO
{
    public function __construct(
        public string $numeroBoleta,
        public float $monto,
        public string $metodoPago,
        public int $idFormulario,
        public ?string $concepto = null,
        public string $estado = 'completado',
        public ?string $comprobanteUrl = null,
        public ?string $fechaPago = null,
    ) {}

    public static function fromRequest(CreateBoletaPagoRequest $request): self
    {
        return new self(
            numeroBoleta: $request->validated('numero_boleta'),
            monto: (float) $request->validated('monto'),
            metodoPago: $request->validated('metodo_pago'),
            idFormulario: (int) $request->validated('id_formulario'),
            concepto: $request->validated('concepto'),
            estado: $request->validated('estado', 'completado'),
            comprobanteUrl: $request->validated('comprobante_url'),
            fechaPago: $request->validated('fecha_pago'),
        );
    }
}
