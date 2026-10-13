<?php

namespace App\Http\Requests\Entrenamiento;

use Illuminate\Foundation\Http\FormRequest;

class UploadEjercicioImagenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'titulo' => 'required|string|max:150',
            'descripcion' => 'nullable|string',
            'orden' => 'nullable|integer',
        ];
    }
}
