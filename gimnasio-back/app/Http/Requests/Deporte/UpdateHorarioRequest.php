<?php

namespace App\Http\Requests\Deporte;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHorarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => 'required|exists:horarios,id',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
        ];
    }
}
