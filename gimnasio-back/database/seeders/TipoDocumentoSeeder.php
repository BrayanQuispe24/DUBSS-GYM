<?php

namespace Database\Seeders;

use App\Models\TipoDocumento;
use Illuminate\Database\Seeder;

class TipoDocumentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipos = [
            [
                'nombre' => 'Boleta de inscripción',
                'descripcion' => 'Comprobante o boleta digital de inscripción al gimnasio D.U.B.S.S. UAGRM.',
            ],
            [
                'nombre' => 'Fotocopia de carnet',
                'descripcion' => 'Fotocopia o escaneo digital del Carnet de Identidad (CI) del usuario/atleta.',
            ],
        ];

        foreach ($tipos as $tipo) {
            TipoDocumento::updateOrCreate(
                ['nombre' => $tipo['nombre']],
                $tipo
            );
        }
    }
}
