<?php

namespace App\Http\Requests\Entrenamiento;

use Illuminate\Foundation\Http\FormRequest;

class AsignarGrupoMuscularRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_ejercicio' => 'required|exists:ejercicios,id',
            'id_grupo_muscular' => 'required|exists:grupo_muscular,id',
        ];
    }
}
