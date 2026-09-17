<?php

namespace App\Actions\Usuario;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class ListarUsuariosAction
{
    public function execute(array $filters = []): Collection
    {
        $query = Usuario::with('rol');
        if (!empty($filters['search'])) {
            $term = strtolower($filters['search']);
            $query->where(function ($q) use ($term) {
                $q->whereRaw('LOWER(nombre) LIKE ?', ["%{$term}%"])
                    ->orWhereRaw('LOWER(apellido) LIKE ?', ["%{$term}%"])
                    ->orWhereRaw('LOWER(email) LIKE ?', ["%{$term}%"])
                    ->orWhereRaw('LOWER(codigo) LIKE ?', ["%{$term}%"])
                    ->orWhereRaw('LOWER(ci) LIKE ?', ["%{$term}%"]);
            });
        }
        if (!empty($filters['rol']) && $filters['rol'] !== 'todos') {
            $query->whereHas('rol', function ($q) use ($filters) {
                $q->whereRaw('LOWER(nombre) = ?', [strtolower($filters['rol'])]);
            });
        }
        if (!empty($filters['estado']) && $filters['estado'] !== 'todos') {
            $estadoBool = in_array($filters['estado'], ['activo', '1', 1, true], true);
            $query->where('estado', $estadoBool);
        }
        return $query->orderBy('id', 'desc')->get();
    }
}
