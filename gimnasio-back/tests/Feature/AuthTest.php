<?php

namespace Tests\Feature;

use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private Rol $rol;

    protected function setUp(): void
    {
        parent::setUp();

        $this->rol = Rol::create([
            'nombre' => 'Cliente',
            'estado' => true,
        ]);
    }

    public function test_user_can_register_successfully(): void
    {
        $response = $this->postJson('/api/register', [
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => 'juan@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'rol' => 'Cliente',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user' => ['id', 'nombre', 'apellido', 'email'],
                'access_token',
                'token_type',
            ]);

        $this->assertDatabaseHas('usuarios', [
            'email' => 'juan@example.com',
        ]);
    }

    public function test_user_cannot_register_with_existing_email(): void
    {
        Usuario::create([
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => 'juan@example.com',
            'password' => Hash::make('password123'),
            'id_rol' => $this->rol->id,
        ]);

        $response = $this->postJson('/api/register', [
            'nombre' => 'Otro',
            'apellido' => 'Usuario',
            'email' => 'juan@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'rol' => 'Cliente',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_user_can_login_with_correct_credentials(): void
    {
        Usuario::create([
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => 'juan@example.com',
            'password' => Hash::make('password123'),
            'id_rol' => $this->rol->id,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'juan@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user',
                'access_token',
                'token_type',
            ]);
    }

    public function test_user_cannot_login_with_incorrect_password(): void
    {
        Usuario::create([
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => 'juan@example.com',
            'password' => Hash::make('password123'),
            'id_rol' => $this->rol->id,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'juan@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_authenticated_user_can_access_profile(): void
    {
        $user = Usuario::create([
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => 'juan@example.com',
            'password' => Hash::make('password123'),
            'id_rol' => $this->rol->id,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/profile');

        $response->assertStatus(200)
            ->assertJson([
                'email' => 'juan@example.com',
            ]);
    }

    public function test_unauthenticated_user_cannot_access_profile(): void
    {
        $response = $this->getJson('/api/profile');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = Usuario::create([
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => 'juan@example.com',
            'password' => Hash::make('password123'),
            'id_rol' => $this->rol->id,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Sesión cerrada exitosamente',
            ]);

        $this->assertCount(0, $user->tokens);
    }

    public function test_unauthenticated_user_cannot_register_privileged_roles(): void
    {
        Rol::create(['nombre' => 'Administrador', 'estado' => true]);

        $response = $this->postJson('/api/register', [
            'nombre' => 'Nuevo',
            'apellido' => 'Admin',
            'email' => 'admin_nuevo@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'rol' => 'Administrador',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_user_can_register_privileged_roles(): void
    {
        $rolAdmin = Rol::create(['nombre' => 'Administrador', 'estado' => true]);
        Rol::create(['nombre' => 'Recepcionista', 'estado' => true]);

        $adminUser = Usuario::create([
            'nombre' => 'Admin',
            'apellido' => 'Principal',
            'email' => 'admin_principal@example.com',
            'password' => Hash::make('password123'),
            'id_rol' => $rolAdmin->id,
        ]);

        $token = $adminUser->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/register', [
                'nombre' => 'Recep',
                'apellido' => 'Uno',
                'email' => 'recep@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'rol' => 'Recepcionista',
            ]);

        $response->assertStatus(201);
    }

    public function test_register_fails_if_role_does_not_exist(): void
    {
        $response = $this->postJson('/api/register', [
            'nombre' => 'Test',
            'apellido' => 'Invalido',
            'email' => 'invalido@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'rol' => 'RolQueNoExiste',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['rol']);
    }
}
