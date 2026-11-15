<?php

namespace Tests\Feature;

use App\Models\BoletaInscripcion;
use App\Models\NotificacionMembresia;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RegistrarNotificacionTest extends TestCase
{
    use RefreshDatabase;

    private Usuario $cliente;
    private BoletaInscripcion $boleta;

    protected function setUp(): void
    {
        parent::setUp();

        $rolCliente = Rol::create(['nombre' => 'Cliente', 'estado' => true]);

        $this->cliente = Usuario::create([
            'nombre' => 'Brayan',
            'apellido' => 'Quispe',
            'email' => 'brayan@notif.com',
            'password' => Hash::make('password123'),
            'id_rol' => $rolCliente->id,
            'estado' => true,
            'telegram_chat_id' => '123456789',
        ]);

        $this->boleta = BoletaInscripcion::create([
            'numero_boleta' => 'INS-NOTIF-001',
            'fecha_inscripcion' => '2026-11-13',
            'fecha_inicio' => '2026-11-13',
            'fecha_fin' => '2026-12-13',
            'disciplina' => 'Gimnasio',
            'monto' => 150,
            'estado' => 'activo',
            'id_usuario' => $this->cliente->id,
        ]);
    }

    public function test_rechaza_registro_sin_api_key_ni_autenticacion(): void
    {
        $payload = [
            'boleta_id' => $this->boleta->id,
            'cliente_id' => $this->cliente->id,
            'fecha_vencimiento' => '2026-12-13',
            'dias_restantes' => 30,
            'canal' => 'telegram',
            'estado' => 'enviado',
            'telegram_message_id' => '999',
        ];

        $response = $this->postJson('/api/integraciones/notificaciones/registrar', $payload);

        $response->assertStatus(401);
    }

    public function test_registra_notificacion_exitosamente_con_x_api_key(): void
    {
        $payload = [
            'boleta_id' => $this->boleta->id,
            'cliente_id' => $this->cliente->id,
            'fecha_vencimiento' => '2026-12-13',
            'dias_restantes' => 3,
            'canal' => 'telegram',
            'estado' => 'enviado',
            'telegram_message_id' => '125',
        ];

        $response = $this->withHeader('X-API-KEY', config('services.n8n.api_key'))
            ->postJson('/api/integraciones/notificaciones/registrar', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'mensaje' => 'Notificación registrada exitosamente',
                'data' => [
                    'boleta_id' => $this->boleta->id,
                    'cliente_id' => $this->cliente->id,
                    'fecha_vencimiento' => '2026-12-13',
                    'dias_restantes' => 3,
                    'canal' => 'telegram',
                    'estado' => 'enviado',
                    'telegram_message_id' => '125',
                ],
            ]);

        $this->assertDatabaseHas('notificaciones_membresia', [
            'id_boleta_inscripcion' => $this->boleta->id,
            'id_usuario' => $this->cliente->id,
            'dias_restantes' => 3,
            'canal' => 'telegram',
            'estado' => 'enviado',
            'telegram_message_id' => '125',
        ]);
    }

    public function test_idempotencia_no_duplica_si_llega_mismo_aviso(): void
    {
        $payload = [
            'boleta_id' => $this->boleta->id,
            'cliente_id' => $this->cliente->id,
            'fecha_vencimiento' => '2026-12-13',
            'dias_restantes' => 3,
            'canal' => 'telegram',
            'estado' => 'enviado',
            'telegram_message_id' => '125',
        ];

        // Primer envío
        $this->withHeader('X-API-KEY', config('services.n8n.api_key'))
            ->postJson('/api/integraciones/notificaciones/registrar', $payload)
            ->assertStatus(201);

        // Segundo envío idéntico (reintento de n8n)
        $response = $this->withHeader('X-API-KEY', config('services.n8n.api_key'))
            ->postJson('/api/integraciones/notificaciones/registrar', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'mensaje' => 'Notificación previamente registrada (idempotente)',
            ]);

        // Debe haber únicamente 1 registro en la BD
        $this->assertEquals(1, NotificacionMembresia::count());
    }

    public function test_registra_notificacion_fallida_con_motivo(): void
    {
        $payload = [
            'boleta_id' => $this->boleta->id,
            'cliente_id' => $this->cliente->id,
            'fecha_vencimiento' => '2026-12-13',
            'dias_restantes' => 1,
            'canal' => 'telegram',
            'estado' => 'fallido',
            'error_motivo' => 'Chat not found o bot bloqueado por el usuario',
        ];

        $response = $this->withHeader('X-API-KEY', config('services.n8n.api_key'))
            ->postJson('/api/integraciones/notificaciones/registrar', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'estado' => 'fallido',
                ],
            ]);

        $this->assertDatabaseHas('notificaciones_membresia', [
            'id_boleta_inscripcion' => $this->boleta->id,
            'estado' => 'fallido',
            'error_motivo' => 'Chat not found o bot bloqueado por el usuario',
        ]);
    }
}

