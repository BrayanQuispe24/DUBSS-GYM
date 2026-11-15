<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificacionMembresia extends Model
{
    use HasFactory;

    protected $table = 'notificaciones_membresia';

    protected $fillable = [
        'id_boleta_inscripcion',
        'id_usuario',
        'fecha_vencimiento',
        'dias_restantes',
        'canal',
        'estado',
        'telegram_message_id',
        'error_motivo',
        'fecha_envio',
    ];

    protected $casts = [
        'fecha_vencimiento' => 'date',
        'dias_restantes' => 'integer',
        'fecha_envio' => 'datetime',
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

