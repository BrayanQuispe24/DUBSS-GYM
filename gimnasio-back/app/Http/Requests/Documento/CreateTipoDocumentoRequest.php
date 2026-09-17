<?php

namespace App\Http\Requests\Documento;

use Illuminate\Foundation\Http\FormRequest;

class CreateTipoDocumentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:100|unique:tipo_documentos,nombre',
            'descripcion' => 'nullable|string|max:255',
        ];
    }
}
