<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'codigo',
        'nombre',
        'apellido',
        'estado',
        'ci',
        'celular',
        'email',
        'acepta_terminos',
        'fecha_acepta_terminos',
        'tipo_usuario',
        'fecha_registro',
        'password',
        'id_rol',
        'id_disciplina',
    ];

    protected $hidden = [
        'password',
    ];

    protected $appends = ['name', 'registro_universitario'];

    public function getNameAttribute(): string
    {
        $fullName = trim(($this->nombre ?? '') . ' ' . ($this->apellido ?? ''));
        return $fullName !== '' ? $fullName : ($this->email ?? 'Usuario');
    }

    public function getRegistroUniversitarioAttribute(): ?string
    {
        return $this->codigo;
    }

    public function getRolNombre(): string
    {
        $this->loadMissing('rol');
        return mb_strtolower($this->rol ? $this->rol->nombre : ($this->tipo_usuario ?? 'cliente'));
    }

    public function esAdmin(): bool
    {
        return $this->getRolNombre() === 'administrador';
    }

    public function esInstructor(): bool
    {
        return $this->getRolNombre() === 'instructor';
    }

    public function esCliente(): bool
    {
        return $this->getRolNombre() === 'cliente';
    }

    public function puedeGestionarEntrenamiento(): bool
    {
        return in_array($this->getRolNombre(), ['administrador', 'instructor'], true);
    }

    protected function casts(): array
    {
        return [
            'fecha_registro' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function rol(): BelongsTo
    {
        return $this->belongsTo(Rol::class, 'id_rol');
    }

    public function disciplina(): BelongsTo
    {
        return $this->belongsTo(Disciplina::class, 'id_disciplina');
    }

    public function historiales(): HasMany
    {
        return $this->hasMany(Historial::class, 'id_usuario');
    }

    public function documentos(): HasMany
    {
        return $this->hasMany(Documento::class, 'id_usuario');
    }

    public function formularioSolicitudes(): HasMany
    {
        return $this->hasMany(FormularioSolicitud::class, 'id_usuario');
    }

    public function boletasInscripcion(): HasMany
    {
        return $this->hasMany(BoletaInscripcion::class, 'id_usuario');
    }

    public function registrosEntradaSalida(): HasMany
    {
        return $this->hasMany(RegistroEntradaSalida::class, 'id_usuario');
    }

    public function planesAlimentacion(): HasMany
    {
        return $this->hasMany(PlanAlimentacion::class, 'id_usuario');
    }

    public function planesEntrenamiento(): HasMany
    {
        return $this->hasMany(PlanEntrenamiento::class, 'id_usuario');
    }

    public function movimientosInventario(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class, 'id_usuario');
    }
}
