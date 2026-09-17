<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTipoMovimientoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tipoId = $this->route('tipo_movimiento')?->id ?? $this->route('tipo_movimiento');

        return [
            'nombre' => ['sometimes', 'required', 'string', 'max:255', 'unique:tipo_movimiento,nombre,' . $tipoId],
            'descripcion' => ['nullable', 'string'],
            'es_salida' => ['sometimes', 'boolean'],
        ];
    }
}
