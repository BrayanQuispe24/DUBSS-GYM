<?php

namespace App\Actions\Inventario;

use App\DTOs\Inventario\UpdateMantenimientoDTO;
use App\Models\Equipo;
use App\Models\Mantenimiento;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class UpdateMantenimientoAction
{
    public function execute(Mantenimiento $mantenimiento, UpdateMantenimientoDTO $dto): Mantenimiento
    {
        return DB::transaction(function () use ($mantenimiento, $dto) {
            $oldEstado = (bool) $mantenimiento->estado;
            $equipo = $mantenimiento->equipo ?? Equipo::findOrFail($mantenimiento->id_equipo);
            $cant = $dto->cantidad ?? $mantenimiento->cantidad;

            if ($dto->estado !== null && $dto->estado !== $oldEstado) {
                if ($oldEstado && !$dto->estado) {
                    // Pendiente -> Completado: el stock vuelve a estar disponible
                    $equipo->increment('cantidad', $cant);
                } elseif (!$oldEstado && $dto->estado) {
                    // Completado -> Pendiente: reducir el stock de nuevo
                    if ($equipo->cantidad < $cant) {
                        throw new InvalidArgumentException("Stock disponible insuficiente ({$equipo->cantidad}) para reabrir mantenimiento de {$cant} unidad(es).");
                    }
                    $equipo->decrement('cantidad', $cant);
                }
            }

            $mantenimiento->update($dto->toArray());
            return $mantenimiento;
        });
    }
}
