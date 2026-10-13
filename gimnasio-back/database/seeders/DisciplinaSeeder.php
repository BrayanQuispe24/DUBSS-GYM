<?php

namespace Database\Seeders;

use App\Models\Disciplina;
use Illuminate\Database\Seeder;

class DisciplinaSeeder extends Seeder
{
    public function run(): void
    {
        $disciplinas = [
            [
                'nombre' => 'Boxeo',
                'cantidad_cupos' => 30,
                'estado' => true,
            ],
            [
                'nombre' => 'Kick Boxing',
                'cantidad_cupos' => 30,
                'estado' => true,
            ],
            [
                'nombre' => 'Ejercicios funcionales',
                'cantidad_cupos' => 30,
                'estado' => true,
            ],
            [
                'nombre' => 'Jiu Jitsu',
                'cantidad_cupos' => 30,
                'estado' => true,
            ],
        ];

        foreach ($disciplinas as $d) {
            Disciplina::updateOrCreate(
                ['nombre' => $d['nombre']],
                $d
            );
        }
    }
}
