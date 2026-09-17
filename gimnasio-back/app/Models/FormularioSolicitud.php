<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FormularioSolicitud extends Model
{
    use HasFactory;

    protected $table = 'formulario_solicitud';

    protected $fillable = [
        'numero_formulario',
        'estado',
        'fecha_registro',
        'id_disciplina',
        'id_usuario',
    ];

    public function disciplina(): BelongsTo
    {
        return $this->belongsTo(Disciplina::class, 'id_disciplina');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function boletasPago(): HasMany
    {
        return $this->hasMany(BoletaPago::class, 'id_formulario');
    }
}
