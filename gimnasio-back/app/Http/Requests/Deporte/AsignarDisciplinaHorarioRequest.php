<?php

namespace App\Http\Requests\Deporte;

use Illuminate\Foundation\Http\FormRequest;

class AsignarDisciplinaHorarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_disciplina' => 'required|exists:disciplinas,id',
            'id_horario' => 'required|exists:horarios,id',
            'cupo_maximo' => 'required|integer|min:1',
            'estado' => 'nullable|boolean',
        ];
    }
}
