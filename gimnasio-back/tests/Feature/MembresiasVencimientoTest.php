<?php

namespace Tests\Feature;

use App\Models\BoletaInscripcion;
use App\Models\Rol;
use App\Models\Usuario;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class MembresiasVencimientoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('services.n8n.api_key', 'test_n8n_secret_key');
    }

    public function test_rechaza_acceso_sin_api_key_ni_autenticacion(): void
    {
        $response = $this->getJson('/api/boletas-inscripcion/vencimientos');

        $response->assertStatus(401);
    }

    public function test_rechaza_acceso_con_api_key_invalida(): void
    {
        $response = $this->withHeaders([
            'X-API-KEY' => 'clave_incorrecta',
        ])->getJson('/api/boletas-inscripcion/vencimientos');

        $response->assertStatus(401);
    }

    public function test_retorna_membresias_con_formato_exacto_usando_x_api_key(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-11-13'));

        $rolCliente = Rol::create(['nombre' => 'Cliente', 'estado' => true]);

        $usuarioCarlos = Usuario::create([
            'codigo' => 'CLI101',
            'nombre' => 'Carlos',
            'apellido' => 'Vargas',
            'email' => 'carlos@ejemplo.com',
            'tipo_usuario' => 'estudiante',
            'estado' => true,
            'password' => Hash::make('password123'),
            'id_rol' => $rolCliente->id,
            'telegram_chat_id' => '123456789',
        ]);

        $usuarioMaria = Usuario::create([
            'codigo' => 'CLI102',
            'nombre' => 'Maria',
            'apellido' => 'Lopez',
            'email' => 'maria@ejemplo.com',
            'tipo_usuario' => 'estudiante',
            'estado' => true,
            'password' => Hash::make('password123'),
            'id_rol' => $rolCliente->id,
            'telegram_chat_id' => '987654321',
        ]);

        $boletaCarlos = BoletaInscripcion::create([
            'numero_boleta' => 'BOL-101',
            'fecha_inscripcion' => '2026-10-16',
            'fecha_inicio' => '2026-10-16',
            'fecha_fin' => '2026-11-16',
            'monto' => 150.00,
            'estado' => 'activo',
            'id_usuario' => $usuarioCarlos->id,
        ]);

        $boletaMaria = BoletaInscripcion::create([
            'numero_boleta' => 'BOL-102',
            'fecha_inscripcion' => '2026-10-14',
            'fecha_inicio' => '2026-10-14',
            'fecha_fin' => '2026-11-14',
            'monto' => 150.00,
            'estado' => 'activa',
            'id_usuario' => $usuarioMaria->id,
        ]);

        $response = $this->withHeaders([
            'X-API-KEY' => 'test_n8n_secret_key',
        ])->getJson('/api/boletas-inscripcion/vencimientos');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'membresias' => [
                '*' => [
                    'boleta_id',
                    'cliente_id',
                    'nombre',
                    'fecha_vencimiento',
                    'dias_restantes',
                    'estado',
                    'telegram_chat_id',
                ],
            ],
        ]);

        $response->assertJson([
            'membresias' => [
                [
                    'boleta_id' => $boletaMaria->id,
                    'cliente_id' => $usuarioMaria->id,
                    'nombre' => 'Maria',
                    'fecha_vencimiento' => '2026-11-14',
                    'dias_restantes' => 1,
                    'estado' => 'activa',
                    'telegram_chat_id' => '987654321',
                ],
                [
                    'boleta_id' => $boletaCarlos->id,
                    'cliente_id' => $usuarioCarlos->id,
                    'nombre' => 'Carlos',
                    'fecha_vencimiento' => '2026-11-16',
                    'dias_restantes' => 3,
                    'estado' => 'activa',
                    'telegram_chat_id' => '123456789',
                ],
            ],
        ]);

        Carbon::setTestNow();
    }

    public function test_filtro_por_dias(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-11-13'));

        $rolCliente = Rol::create(['nombre' => 'Cliente', 'estado' => true]);

        $usuarioCarlos = Usuario::create([
            'nombre' => 'Carlos',
            'apellido' => 'Vargas',
            'email' => 'carlos2@ejemplo.com',
            'password' => Hash::make('password123'),
            'id_rol' => $rolCliente->id,
            'telegram_chat_id' => '123456789',
        ]);

        $usuarioMaria = Usuario::create([
            'nombre' => 'Maria',
            'apellido' => 'Lopez',
            'email' => 'maria2@ejemplo.com',
            'password' => Hash::make('password123'),
            'id_rol' => $rolCliente->id,
            'telegram_chat_id' => '987654321',
        ]);

        BoletaInscripcion::create([
            'numero_boleta' => 'BOL-A',
            'fecha_fin' => '2026-11-14', // 1 día restante
            'monto' => 100,
            'estado' => 'activo',
            'id_usuario' => $usuarioMaria->id,
        ]);

        BoletaInscripcion::create([
            'numero_boleta' => 'BOL-B',
            'fecha_fin' => '2026-11-20', // 7 días restantes
            'monto' => 100,
            'estado' => 'activo',
            'id_usuario' => $usuarioCarlos->id,
        ]);

        // Filtrar por los próximos 2 días (debe retornar solo María)
        $response = $this->withHeaders([
            'X-API-KEY' => 'test_n8n_secret_key',
        ])->getJson('/api/boletas-inscripcion/vencimientos?dias=2');

        $response->assertStatus(200);
        $data = $response->json('membresias');
        $this->assertCount(1, $data);
        $this->assertSame('Maria', $data[0]['nombre']);
        $this->assertSame(1, $data[0]['dias_restantes']);

        Carbon::setTestNow();
    }

    public function test_permite_acceso_con_token_sanctum_a_administrador(): void
    {
        $rolAdmin = Rol::create(['nombre' => 'Administrador', 'estado' => true]);

        $admin = Usuario::create([
            'nombre' => 'Admin',
            'apellido' => 'General',
            'email' => 'admin@ejemplo.com',
            'tipo_usuario' => 'administrativo',
            'estado' => true,
            'password' => Hash::make('password123'),
            'id_rol' => $rolAdmin->id,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/boletas-inscripcion/vencimientos');

        $response->assertStatus(200);
        $response->assertJsonStructure(['membresias']);
    }
}
