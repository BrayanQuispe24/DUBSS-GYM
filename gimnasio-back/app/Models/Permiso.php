<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Permiso extends Model
{
    use HasFactory;

    protected $table = 'permisos';

    protected $fillable = [
        'nombre',
        'estado',
    ];

    public function rolPermisos(): HasMany
    {
        return $this->hasMany(RolPermiso::class, 'id_permiso');
    }
}
