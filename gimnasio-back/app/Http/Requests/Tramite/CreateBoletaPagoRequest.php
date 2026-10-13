<?php

namespace App\Http\Requests\Tramite;

use Illuminate\Foundation\Http\FormRequest;

class CreateBoletaPagoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'numero_boleta' => 'required|string|max:50|unique:boleta_pago,numero_boleta',
            'monto' => 'required|numeric|min:0',
            'metodo_pago' => 'required|string|max:50',
            'concepto' => 'nullable|string',
            'estado' => 'nullable|string|max:50',
            'comprobante_url' => 'nullable|string',
            'id_formulario' => 'required|exists:formulario_solicitud,id',
            'fecha_pago' => 'nullable|date',
        ];
    }
}
