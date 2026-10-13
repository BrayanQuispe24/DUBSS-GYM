<?php

namespace App\Http\Requests\Deporte;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDisciplinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $disciplinaParam = $this->route('disciplina') ?? $this->route('id') ?? $this->input('id');
        $id = is_object($disciplinaParam) ? $disciplinaParam->id : $disciplinaParam;

        return [
            'id' => 'nullable|exists:disciplinas,id',
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('disciplinas', 'nombre')->ignore($id),
            ],
            'cantidad_cupos' => 'required|integer|min:1',
            'estado' => 'nullable|string',
            'descripcion' => 'nullable|string',
        ];
    }
}
