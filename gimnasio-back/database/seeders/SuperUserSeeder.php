<?php

namespace Database\Seeders;

use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //asegurarnos que existe el rol superUsuario
        $rolAdmin = Rol::firstOrCreate(
            ['nombre' => 'Administrador'],
            ['estado' => true]
        );
        //crear el usuario superusuario si no existe
        Usuario::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'codigo' => '123456789',
                'nombre' => 'Super',
                'apellido' => 'Admin',
                'estado' => true,
                'ci' => '12345678',
                'celular' => '63439671',
                'password' => Hash::make('admin123456'),
                'id_rol' => $rolAdmin->id,
                'fecha_registro' => now(),
            ]
        );
    }
}
