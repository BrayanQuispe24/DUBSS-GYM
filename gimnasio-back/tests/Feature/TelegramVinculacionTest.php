<?php

namespace Tests\Feature;

use App\Models\Rol;
use App\Models\TelegramVinculacionToken;
use App\Models\Usuario;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class TelegramVinculacionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('services.n8n.api_key', 'test_n8n_secret_key');
        Config::set('services.telegram.bot_username', 'dubss_gym_bot');
    }

    private function crearCliente(string $nombre = 'Carlos', ?string $telegramChatId = null): Usuario
    {
        $rolCliente = Rol::firstOrCreate(
            ['nombre' => 'Cliente'],
            ['estado' => true]
        );

        return Usuario::create([
            'codigo' => 'CLI' . rand(1000, 9999),
            'nombre' => $nombre,
            'apellido' => 'Vargas',
            'email' => strtolower($nombre) . rand(100, 999) . '@uagrm.edu.bo',
            'tipo_usuario' => 'estudiante',
            'estado' => true,
            'password' => Hash::make('password123'),
            'id_rol' => $rolCliente->id,
            'telegram_chat_id' => $telegramChatId,
        ]);
    }

    public function test_rechaza_acceso_sin_api_key_ni_autenticacion(): void
    {
        $response = $this->postJson('/api/integraciones/telegram/vincular', [
            'token' => 'TG-123456',
            'telegram_chat_id' => '987654321',
        ]);

        $response->assertStatus(401);
    }

    public function test_rechaza_acceso_con_api_key_invalida(): void
    {
        $response = $this->withHeaders([
            'X-API-KEY' => 'clave_invalida',
        ])->postJson('/api/integraciones/telegram/vincular', [
            'token' => 'TG-123456',
            'telegram_chat_id' => '987654321',
        ]);

        $response->assertStatus(401);
    }

    public function test_rechaza_token_inexistente_con_respuesta_controlada(): void
    {
        $response = $this->withHeaders([
            'X-API-KEY' => 'test_n8n_secret_key',
        ])->postJson('/api/integraciones/telegram/vincular', [
            'token' => 'TG-INEXISTENTE',
            'telegram_chat_id' => '987654321',
            'telegram_user_id' => '11223344',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => false,
            'telegram_chat_id' => '987654321',
        ]);
        $this->assertStringContainsString('no existe', $response->json('mensaje'));
    }

    public function test_rechaza_token_expirado_con_respuesta_controlada(): void
    {
        $cliente = $this->crearCliente('Maria');

        TelegramVinculacionToken::create([
            'id_usuario' => $cliente->id,
            'token' => 'TG-EXPIRADO',
            'expires_at' => Carbon::now()->subMinutes(5), // Expirado hace 5 min
        ]);

        $response = $this->withHeaders([
            'X-API-KEY' => 'test_n8n_secret_key',
        ])->postJson('/api/integraciones/telegram/vincular', [
            'token' => 'TG-EXPIRADO',
            'telegram_chat_id' => '999888777',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => false,
            'telegram_chat_id' => '999888777',
        ]);
        $this->assertStringContainsString('expirado', $response->json('mensaje'));
    }

    public function test_rechaza_token_ya_utilizado_con_respuesta_controlada(): void
    {
        $cliente = $this->crearCliente('Roberto');

        TelegramVinculacionToken::create([
            'id_usuario' => $cliente->id,
            'token' => 'TG-USADO',
            'expires_at' => Carbon::now()->addMinutes(10),
            'used_at' => Carbon::now()->subMinute(),
            'telegram_chat_id' => '111222333',
        ]);

        $response = $this->withHeaders([
            'X-API-KEY' => 'test_n8n_secret_key',
        ])->postJson('/api/integraciones/telegram/vincular', [
            'token' => 'TG-USADO',
            'telegram_chat_id' => '999888777',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => false,
            'telegram_chat_id' => '999888777',
        ]);
        $this->assertStringContainsString('ya ha sido utilizado', $response->json('mensaje'));
    }

    public function test_vinculacion_exitosa_guarda_telegram_chat_id_en_usuario(): void
    {
        $cliente = $this->crearCliente('Carlos');

        TelegramVinculacionToken::create([
            'id_usuario' => $cliente->id,
            'token' => 'TG-VALIDO7',
            'expires_at' => Carbon::now()->addMinutes(15),
        ]);

        $response = $this->withHeaders([
            'X-API-KEY' => 'test_n8n_secret_key',
        ])->postJson('/api/integraciones/telegram/vincular', [
            'token' => 'TG-VALIDO7',
            'telegram_chat_id' => '123456789',
            'telegram_user_id' => '98765432',
        ]);

        $response->assertStatus(200);
        $response->assertExactJson([
            'success' => true,
            'cliente_id' => $cliente->id,
            'nombre' => 'Carlos',
            'telegram_chat_id' => '123456789',
            'mensaje' => 'Cuenta vinculada correctamente',
        ]);

        // Verificar que el usuario tenga guardado el telegram_chat_id permanentemente
        $cliente->refresh();
        $this->assertEquals('123456789', $cliente->telegram_chat_id);

        // Verificar que el token quedó marcado como usado
        $token = TelegramVinculacionToken::where('token', 'TG-VALIDO7')->first();
        $this->assertNotNull($token->used_at);
        $this->assertEquals('123456789', $token->telegram_chat_id);
        $this->assertEquals('98765432', $token->telegram_user_id);
    }

    public function test_cliente_puede_generar_token_consultar_estado_y_desvincular(): void
    {
        $cliente = $this->crearCliente('Lucia');

        // 1. Consultar estado inicial (no vinculado)
        $respEstado = $this->actingAs($cliente)->getJson('/api/cliente/telegram/estado');
        $respEstado->assertStatus(200);
        $respEstado->assertJson([
            'success' => true,
            'vinculado' => false,
            'telegram_chat_id' => null,
        ]);

        // 2. Generar token temporal
        $respToken = $this->actingAs($cliente)->postJson('/api/cliente/telegram/solicitar-token');
        $respToken->assertStatus(200);
        $respToken->assertJson([
            'success' => true,
        ]);
        $data = $respToken->json('data');
        $this->assertNotNull($data['token']);
        $this->assertStringStartsWith('TG-', $data['token']);
        $this->assertEquals(15, $data['expires_in_minutes']);
        $this->assertStringContainsString('t.me/dubss_gym_bot?start=' . $data['token'], $data['deep_link']);

        // 3. Simular vinculación con el token generado
        $respVincular = $this->withHeaders([
            'X-API-KEY' => 'test_n8n_secret_key',
        ])->postJson('/api/integraciones/telegram/vincular', [
            'token' => $data['token'],
            'telegram_chat_id' => '555666777',
        ]);
        $respVincular->assertStatus(200);
        $respVincular->assertJson([
            'success' => true,
            'cliente_id' => $cliente->id,
            'telegram_chat_id' => '555666777',
        ]);

        // 4. Consultar estado post-vinculación
        $respEstadoPost = $this->actingAs($cliente->fresh())->getJson('/api/cliente/telegram/estado');
        $respEstadoPost->assertStatus(200);
        $respEstadoPost->assertJson([
            'success' => true,
            'vinculado' => true,
            'telegram_chat_id' => '555666777',
        ]);

        // 5. Desvincular
        $respDesvincular = $this->actingAs($cliente->fresh())->deleteJson('/api/cliente/telegram/desvincular');
        $respDesvincular->assertStatus(200);
        $respDesvincular->assertJson([
            'success' => true,
        ]);

        $cliente->refresh();
        $this->assertNull($cliente->telegram_chat_id);
    }
}
