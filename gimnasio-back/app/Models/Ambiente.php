<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ambiente extends Model
{
    use HasFactory;

    protected $table = 'ambientes';

    protected $fillable = [
        'nombre',
        'descripcion',
        'estado',
    ];

    protected $casts = [
        'estado' => 'boolean',
    ];

    public function equipos(): HasMany
    {
        return $this->hasMany(Equipo::class, 'id_ambiente');
    }
}
