<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMarcaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $marcaId = $this->route('marca')?->id ?? $this->route('marca');

        return [
            'nombre' => ['sometimes', 'required', 'string', 'max:255', 'unique:marcas,nombre,' . $marcaId],
            'estado' => ['sometimes', 'nullable'],
        ];
    }
}
