<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable;

class RegistroEntradaSalida extends Model implements Auditable
{
    use HasFactory, \OwenIt\Auditing\Auditable;

    protected $table = 'registro_entrada_salida';

    protected $fillable = [
        'fecha_hora',
        'tipo',
        'id_boleta_inscripcion',
        'id_usuario',
    ];

    public function boletaInscripcion(): BelongsTo
    {
        return $this->belongsTo(BoletaInscripcion::class, 'id_boleta_inscripcion');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
