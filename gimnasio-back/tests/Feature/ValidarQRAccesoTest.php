<?php

namespace Tests\Feature;

use App\Actions\Tramite\GenerarQRCodeBoletaInscripcionAction;
use App\Models\BoletaInscripcion;
use App\Models\Rol;
use App\Models\Usuario;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ValidarQRAccesoTest extends TestCase
{
    use RefreshDatabase;

    public function test_validar_qr_fuera_de_horario_retorna_200_con_permitido_false(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-11-13 15:30:00'));

        $rolAdmin = Rol::create(['nombre' => 'Administrador', 'estado' => true]);
        $rolCliente = Rol::create(['nombre' => 'Cliente', 'estado' => true]);

        $admin = Usuario::create([
            'nombre' => 'Admin',
            'apellido' => 'General',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
            'id_rol' => $rolAdmin->id,
            'estado' => true,
        ]);

        $socio = Usuario::create([
            'nombre' => 'Brayan',
            'apellido' => 'Quispe',
            'email' => 'brayan@test.com',
            'password' => Hash::make('password123'),
            'id_rol' => $rolCliente->id,
            'estado' => true,
        ]);

        $boleta = BoletaInscripcion::create([
            'numero_boleta' => 'INS-TEST-001',
            'fecha_inscripcion' => '2026-11-13',
            'fecha_inicio' => '2026-11-13',
            'fecha_fin' => '2026-12-13',
            'hora_inicio' => '08:00:00',
            'hora_salida' => '10:00:00',
            'disciplina' => 'Boxeo',
            'monto' => 150,
            'estado' => 'activo',
            'id_usuario' => $socio->id,
        ]);

        $qrData = (new GenerarQRCodeBoletaInscripcionAction)->execute($boleta->id);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/registro-accesos/validar-qr', [
                'qr_payload' => $qrData['qr_payload'],
                'tipo' => 'auto',
            ]);

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/json');
        $response->assertHeader('Connection', 'close');
        $this->assertNotEmpty($response->headers->get('Content-Length'));

        $response->assertJson([
            'permitido' => false,
            'motivo' => 'FUERA_DE_HORARIO',
        ]);

        Carbon::setTestNow();
    }
}

