<?php

namespace App\Http\Requests\Documento;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTipoDocumentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id') ?? $this->input('id');
        return [
            'id' => 'required|exists:tipo_documentos,id',
            'nombre' => 'required|string|max:100|unique:tipo_documentos,nombre,' . $id,
            'descripcion' => 'nullable|string|max:255',
        ];
    }
}
