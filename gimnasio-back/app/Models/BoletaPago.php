<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BoletaPago extends Model
{
    use HasFactory;

    protected $table = 'boleta_pago';

    protected $fillable = [
        'numero_boleta',
        'fecha_pago',
        'monto',
        'metodo_pago',
        'concepto',
        'estado',
        'comprobante_url',
        'id_formulario',
    ];

    public function formularioSolicitud(): BelongsTo
    {
        return $this->belongsTo(FormularioSolicitud::class, 'id_formulario');
    }
}
