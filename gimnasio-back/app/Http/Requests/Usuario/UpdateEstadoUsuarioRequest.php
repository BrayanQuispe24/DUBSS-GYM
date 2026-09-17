<?php

namespace App\Http\Requests\Usuario;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEstadoUsuarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id' => 'required|exists:usuarios,id',
            'estado' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'id.required' => 'El ID del usuario es obligatorio.',
            'id.exists' => 'El usuario no existe.',
            'estado.required' => 'El estado es obligatorio.',
        ];
    }

    public function attributes(): array
    {
        return [
            'estado' => 'estado',
        ];
    }
}
