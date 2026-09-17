<?php

namespace App\Http\Requests\Deporte;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDisciplinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id') ?? $this->input('id');
        return [
            'id' => 'required|exists:disciplinas,id',
            'nombre' => 'required|string|max:100|unique:disciplinas,nombre,' . $id,
            'cantidad_cupos' => 'required|integer|min:1',
            'estado' => 'nullable|string',
        ];
    }
}
