<?php

namespace App\Actions\Tramite;

use App\DTOs\Tramite\CreateBoletaPagoDTO;
use App\Models\BoletaPago;

class CreateBoletaPagoAction
{
    public function execute(CreateBoletaPagoDTO $dto): BoletaPago
    {
        $boleta = BoletaPago::create([
            'numero_boleta' => $dto->numeroBoleta,
            'monto' => $dto->monto,
            'metodo_pago' => $dto->metodoPago,
            'concepto' => $dto->concepto,
            'estado' => $dto->estado,
            'comprobante_url' => $dto->comprobanteUrl,
            'id_formulario' => $dto->idFormulario,
            'fecha_pago' => $dto->fechaPago ?? now(),
        ]);

        return $boleta->load('formularioSolicitud');
    }
}
