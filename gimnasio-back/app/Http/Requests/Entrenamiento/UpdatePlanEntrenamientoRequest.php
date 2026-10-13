<?php

namespace App\Http\Requests\Entrenamiento;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanEntrenamientoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'sometimes|required|string|max:100',
            'objetivo' => 'nullable|string',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'estado' => 'nullable|boolean',
            'observacion' => 'nullable|string',
            'id_usuario' => 'sometimes|required|exists:usuarios,id',
            'rutinas' => 'nullable|array',
            'rutinas.*.id_rutina' => 'required|exists:rutinas,id',
            'rutinas.*.dia_semana' => 'nullable|string|max:20',
            'rutinas.*.orden' => 'nullable|integer|min:1',
        ];
    }
}
