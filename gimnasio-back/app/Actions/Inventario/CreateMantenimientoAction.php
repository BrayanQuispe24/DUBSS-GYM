<?php

namespace App\Actions\Inventario;

use App\DTOs\Inventario\CreateMantenimientoDTO;
use App\Models\Equipo;
use App\Models\Mantenimiento;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CreateMantenimientoAction
{
    public function execute(CreateMantenimientoDTO $dto): Mantenimiento
    {
        return DB::transaction(function () use ($dto) {
            $equipo = Equipo::findOrFail($dto->idEquipo);

            if ($dto->estado) {
                if ($equipo->cantidad < $dto->cantidad) {
                    throw new InvalidArgumentException("Stock disponible insuficiente ({$equipo->cantidad}) para ingresar {$dto->cantidad} unidad(es) a mantenimiento.");
                }
                $equipo->decrement('cantidad', $dto->cantidad);
            }

            return Mantenimiento::create($dto->toArray());
        });
    }
}
