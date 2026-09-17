<?php

namespace App\Http\Requests\Seguridad;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePermisoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id') ?? $this->input('id');
        return [
            'id' => 'required|exists:permisos,id',
            'nombre' => 'required|string|max:100|unique:permisos,nombre,' . $id,
            'estado' => 'nullable|boolean',
        ];
    }
}
