<?php

namespace Tests\Feature;

use App\Models\Audit;
use App\Models\Rol;
use App\Models\Tarifa;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuditTrailTest extends TestCase
{
    use RefreshDatabase;

    protected Usuario $admin;
    protected Usuario $cliente;

    protected function setUp(): void
    {
        parent::setUp();

        $rolAdmin = Rol::create(['nombre' => 'Administrador', 'estado' => true]);
        $rolCliente = Rol::create(['nombre' => 'Cliente', 'estado' => true]);

        $this->admin = Usuario::create([
            'nombre' => 'Admin',
            'apellido' => 'General',
            'email' => 'admin@dubssgym.com',
            'password' => Hash::make('secret123'),
            'id_rol' => $rolAdmin->id,
            'estado' => true,
        ]);

        $this->cliente = Usuario::create([
            'nombre' => 'Juan',
            'apellido' => 'Perez',
            'email' => 'juan@uagrm.edu.bo',
            'password' => Hash::make('secret123'),
            'id_rol' => $rolCliente->id,
            'estado' => true,
        ]);
    }

    public function test_modifying_auditable_model_creates_audit_record(): void
    {
        Sanctum::actingAs($this->admin);

        $tarifa = Tarifa::create([
            'nombre' => 'Tarifa Estudiante',
            'precio' => 50.00,
            'estado' => true,
        ]);

        $this->assertDatabaseHas('audits', [
            'auditable_type' => Tarifa::class,
            'auditable_id' => $tarifa->id,
            'event' => 'created',
            'user_id' => $this->admin->id,
        ]);

        // Update tarifa
        $tarifa->update(['precio' => 60.00]);

        $auditUpdate = Audit::where('auditable_type', Tarifa::class)
            ->where('auditable_id', $tarifa->id)
            ->where('event', 'updated')
            ->first();

        $this->assertNotNull($auditUpdate);
        $this->assertEquals(50.00, $auditUpdate->old_values['precio']);
        $this->assertEquals(60.00, $auditUpdate->new_values['precio']);
    }

    public function test_sensitive_attributes_are_excluded_from_user_audit(): void
    {
        Sanctum::actingAs($this->admin);

        $nuevoUsuario = Usuario::create([
            'nombre' => 'Test',
            'apellido' => 'User',
            'email' => 'testuser@uagrm.edu.bo',
            'password' => Hash::make('supersecret'),
            'id_rol' => $this->cliente->id_rol,
            'estado' => true,
        ]);

        $audit = Audit::where('auditable_type', Usuario::class)
            ->where('auditable_id', $nuevoUsuario->id)
            ->first();

        $this->assertNotNull($audit);
        $this->assertArrayNotHasKey('password', $audit->new_values ?? []);
    }

    public function test_admin_can_access_audit_list_and_stats(): void
    {
        Sanctum::actingAs($this->admin);

        // Generate some sample audits
        Tarifa::create(['nombre' => 'Plan A', 'precio' => 100, 'estado' => true]);

        $responseList = $this->getJson('/api/audits');
        $responseList->assertStatus(200)
            ->assertJsonStructure([
                'current_page',
                'data' => [
                    '*' => ['id', 'event', 'auditable_type', 'created_at']
                ],
                'total',
            ]);

        $responseStats = $this->getJson('/api/audits/stats');
        $responseStats->assertStatus(200)
            ->assertJsonStructure([
                'total_events',
                'events_today',
                'events_by_type' => ['created', 'updated', 'deleted', 'login', 'other'],
                'daily_volume',
                'top_users',
                'recent_alerts',
            ]);
    }

    public function test_client_is_forbidden_from_accessing_audits(): void
    {
        Sanctum::actingAs($this->cliente);

        $response = $this->getJson('/api/audits');
        $response->assertStatus(403);

        $responseStats = $this->getJson('/api/audits/stats');
        $responseStats->assertStatus(403);
    }

    public function test_admin_can_export_audit_trail_csv(): void
    {
        Sanctum::actingAs($this->admin);

        Tarifa::create(['nombre' => 'Plan Export', 'precio' => 120, 'estado' => true]);

        $response = $this->get('/api/audits/export');
        $response->assertStatus(200);
        $this->assertTrue(str_contains($response->headers->get('content-type') ?? '', 'text/csv'));
    }
}

