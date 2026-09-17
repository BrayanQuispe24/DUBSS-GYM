<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoMovimiento extends Model
{
    use HasFactory;

    protected $table = 'tipo_movimiento';

    protected $fillable = [
        'nombre',
        'descripcion',
        'es_salida',
    ];

    protected $casts = [
        'es_salida' => 'boolean',
    ];

    public function movimientosInventario(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class, 'id_tipo_movimiento');
    }
}
