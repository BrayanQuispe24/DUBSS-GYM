<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanAlimentacion extends Model
{
    use HasFactory;

    protected $table = 'plan_alimentacion';

    protected $fillable = [
        'nombre',
        'objetivo',
        'fecha_inicio',
        'fecha_fin',
        'observacion',
        'estado',
        'id_usuario',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetallePlanAlimentacion::class, 'id_plan_alimentacion');
    }
}
