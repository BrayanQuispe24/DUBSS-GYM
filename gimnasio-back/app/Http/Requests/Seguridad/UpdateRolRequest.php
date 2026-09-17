<?php

namespace App\Http\Requests\Seguridad;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id') ?? $this->input('id');
        return [
            'id' => 'required|exists:roles,id',
            'nombre' => 'required|string|max:100|unique:roles,nombre,' . $id,
            'estado' => 'nullable|boolean',
        ];
    }
}
