<?php

namespace App\Http\Requests\Deporte;

use Illuminate\Foundation\Http\FormRequest;

class CreateHorarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dia_semana' => 'nullable|string|max:150',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
        ];
    }
}
