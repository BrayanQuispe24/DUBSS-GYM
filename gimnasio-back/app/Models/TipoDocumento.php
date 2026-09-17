<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoDocumento extends Model
{
    use HasFactory;

    protected $table = 'tipo_documentos';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public function documentos(): HasMany
    {
        return $this->hasMany(Documento::class, 'id_tipo_documento');
    }
}
