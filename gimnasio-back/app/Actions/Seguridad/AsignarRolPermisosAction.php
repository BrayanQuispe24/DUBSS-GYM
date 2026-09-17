<?php

namespace App\Actions\Seguridad;

use App\DTOs\Seguridad\AsignarRolPermisoDTO;
use App\Models\Rol;
use App\Models\RolPermiso;
use Illuminate\Support\Facades\DB;

class AsignarRolPermisosAction
{
    public function execute(AsignarRolPermisoDTO $dto): Rol
    {
        return DB::transaction(function () use ($dto) {
            $rol = Rol::findOrFail($dto->id_rol);
            RolPermiso::where('id_rol', $dto->id_rol)->delete();

            foreach ($dto->permisos as $id_permiso) {
                RolPermiso::create([
                    'id_rol' => $dto->id_rol,
                    'id_permiso' => $id_permiso,
                ]);
            }

            return $rol->fresh(['rolPermisos.permiso']);
        });
    }
}
