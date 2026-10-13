<?php

namespace App\Http\Requests\Tramite;

use Illuminate\Foundation\Http\FormRequest;

class CreateBoletaInscripcionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'numero_boleta' => 'required|string|max:50|unique:boleta_inscripcion,numero_boleta',
            'monto' => 'required|numeric|min:0',
            'id_usuario' => 'required|exists:usuarios,id',
            'id_tarifa' => 'nullable|exists:tarifas,id',
            'fecha_inscripcion' => 'nullable|date',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'estado' => 'nullable|string|max:50',
            'disciplina' => 'nullable|string|max:100',
            'hora_inicio' => 'nullable|string|max:20',
            'hora_salida' => 'nullable|string|max:20',
            'id_disciplina_horario' => 'nullable|exists:disciplina_horario,id',
            'id_disciplina' => 'nullable|exists:disciplinas,id',
        ];
    }
}
