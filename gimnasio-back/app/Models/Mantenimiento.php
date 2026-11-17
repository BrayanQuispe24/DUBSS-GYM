<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable;

class Mantenimiento extends Model implements Auditable
{
    use HasFactory, \OwenIt\Auditing\Auditable;

    protected $table = 'mantenimientos';

    protected $fillable = [
        'tipo',
        'fecha_inicio',
        'fecha_fin',
        'descripcion',
        'costo',
        'estado',
        'proximo_mantenimiento',
        'observacion',
        'id_equipo',
        'cantidad',
    ];

    protected $casts = [
        'estado' => 'boolean',
        'costo' => 'decimal:2',
        'cantidad' => 'integer',
    ];

    public function equipo(): BelongsTo
    {
        return $this->belongsTo(Equipo::class, 'id_equipo');
    }
}
