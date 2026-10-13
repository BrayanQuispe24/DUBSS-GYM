<?php

namespace App\Actions\Entrenamiento;

use App\Models\Ejercicio;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Schema;

class ListarEjerciciosAction
{
    public function execute(array $filters = []): LengthAwarePaginator|Collection
    {
        $relations = ['tipoEjercicio', 'ejercicioGrupoMusculares.grupoMuscular'];
        if (Schema::hasTable('ejercicio_imagenes')) {
            $relations[] = 'imagenes';
        }

        $query = Ejercicio::with($relations);

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['id_tipo_ejercicio'])) {
            $query->where('id_tipo_ejercicio', $filters['id_tipo_ejercicio']);
        }

        if (! empty($filters['id_grupo_muscular'])) {
            $idGrupo = $filters['id_grupo_muscular'];
            $query->whereHas('ejercicioGrupoMusculares', function ($q) use ($idGrupo) {
                $q->where('id_grupo_muscular', $idGrupo);
            });
        }

        $query->orderBy('nombre', 'asc');

        if (isset($filters['all']) && ($filters['all'] === 'true' || $filters['all'] === true || $filters['all'] === '1')) {
            return $query->get();
        }

        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : 15;
        if ($perPage <= 0) {
            $perPage = 15;
        }

        return $query->paginate($perPage);
    }
}
