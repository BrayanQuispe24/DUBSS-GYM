<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class CreateMovimientoInventarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_equipo' => 'required|exists:equipos,id',
            'id_tipo_movimiento' => 'required|exists:tipo_movimiento,id',
            'cantidad' => 'required|integer|not_in:0',
            'motivo' => 'required|string|max:255',
            'observacion' => 'nullable|string',
        ];
    }
}
