<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rutina extends Model
{
    use HasFactory;

    protected $table = 'rutinas';

    protected $fillable = [
        'nombre',
        'descripcion',
        'nivel',
        'estado',
    ];

    public function planEntrenamientoRutinas(): HasMany
    {
        return $this->hasMany(PlanEntrenamientoRutina::class, 'id_rutina');
    }

    public function rutinaEjercicios(): HasMany
    {
        return $this->hasMany(RutinaEjercicio::class, 'id_rutina');
    }
}
