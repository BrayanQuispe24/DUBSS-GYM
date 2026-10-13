<?php

namespace App\Http\Requests\Tramite;

use Illuminate\Foundation\Http\FormRequest;

class CreateFormularioSolicitudRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'numero_formulario' => 'required|string|max:50|unique:formulario_solicitud,numero_formulario',
            'id_disciplina' => 'required|exists:disciplinas,id',
            'id_disciplina_horario' => 'nullable|exists:disciplina_horario,id',
            'id_plan' => 'nullable|exists:planes,id',
            'id_usuario' => 'required|exists:usuarios,id',
            'estado' => 'nullable|string|max:50',
            'fecha_registro' => 'nullable|date',
            'facultad_carrera' => 'nullable|string|max:255',
            'domicilio' => 'nullable|string|max:255',
            'celular' => 'nullable|string|max:50',
            'sexo' => 'nullable|string|max:20',
            'grupo_sanguineo' => 'nullable|string|max:20',
            'fecha_nacimiento' => 'nullable|date',
            'peso' => 'nullable|numeric',
            'altura' => 'nullable|numeric',
            'antecedentes' => 'nullable|array',
        ];
    }
}
