<?php

namespace App\Http\Requests\Seguridad;

use Illuminate\Foundation\Http\FormRequest;

class AsignarRolPermisoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_rol' => 'required|exists:roles,id',
            'permisos' => 'required|array',
            'permisos.*' => 'exists:permisos,id',
        ];
    }
}
