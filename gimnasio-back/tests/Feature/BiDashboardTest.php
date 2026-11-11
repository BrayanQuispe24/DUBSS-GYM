<?php

namespace Tests\Feature;

use App\Models\BoletaInscripcion;
use App\Models\BoletaPago;
use App\Models\Disciplina;
use App\Models\FormularioSolicitud;
use App\Models\RegistroEntradaSalida;
use App\Models\Rol;
use App\Models\Usuario;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class BiDashboardTest extends TestCase
{
    use RefreshDatabase;

    private Usuario $admin;
    private Usuario $recepcionista;
    private Usuario $cliente;
    private Usuario $instructor;
    private Disciplina $musculacion;
    private Disciplina $natacion;

    protected function setUp(): void
    {
        parent::setUp();

        $rolAdmin = Rol::create(['nombre' => 'Administrador', 'estado' => true]);
        $rolRecep = Rol::create(['nombre' => 'Recepcionista', 'estado' => true]);
        $rolCliente = Rol::create(['nombre' => 'Cliente', 'estado' => true]);
        $rolInstructor = Rol::create(['nombre' => 'Instructor', 'estado' => true]);

        $this->admin = Usuario::create([
            'nombre' => 'Admin',
            'apellido' => 'Sistema',
            'email' => 'admin.bi@uagrm.edu.bo',
            'password' => Hash::make('password123'),
            'id_rol' => $rolAdmin->id,
        ]);

        $this->recepcionista = Usuario::create([
            'nombre' => 'Recep',
            'apellido' => 'Garita',
            'email' => 'recep.bi@uagrm.edu.bo',
            'password' => Hash::make('password123'),
            'id_rol' => $rolRecep->id,
        ]);

        $this->cliente = Usuario::create([
            'nombre' => 'Socio',
            'apellido' => 'Uno',
            'email' => 'cliente.bi@uagrm.edu.bo',
            'password' => Hash::make('password123'),
            'id_rol' => $rolCliente->id,
        ]);

        $this->instructor = Usuario::create([
            'nombre' => 'Coach',
            'apellido' => 'Gym',
            'email' => 'instructor.bi@uagrm.edu.bo',
            'password' => Hash::make('password123'),
            'id_rol' => $rolInstructor->id,
        ]);

        $this->musculacion = Disciplina::create([
            'nombre' => 'Musculación',
            'cantidad_cupos' => 40,
            'estado' => true,
        ]);

        $this->natacion = Disciplina::create([
            'nombre' => 'Natación',
            'cantidad_cupos' => 20,
            'estado' => true,
        ]);

        $tz = config('app.timezone', 'America/La_Paz');
        $hoy = Carbon::now($tz);

        // Solicitudes: 2 aprobadas, 1 pendiente, 1 rechazada
        $solAprob1 = FormularioSolicitud::create([
            'numero_formulario' => 'SOL-001',
            'estado' => 'aprobado',
            'fecha_registro' => $hoy->copy()->subDays(2),
            'id_disciplina' => $this->musculacion->id,
            'id_usuario' => $this->cliente->id,
        ]);

        $solAprob2 = FormularioSolicitud::create([
            'numero_formulario' => 'SOL-002',
            'estado' => 'aprobado',
            'fecha_registro' => $hoy->copy()->subDay(),
            'id_disciplina' => $this->natacion->id,
            'id_usuario' => $this->cliente->id,
        ]);

        FormularioSolicitud::create([
            'numero_formulario' => 'SOL-003',
            'estado' => 'pendiente',
            'fecha_registro' => $hoy->copy(),
            'id_disciplina' => $this->musculacion->id,
            'id_usuario' => $this->cliente->id,
        ]);

        FormularioSolicitud::create([
            'numero_formulario' => 'SOL-004',
            'estado' => 'rechazado',
            'fecha_registro' => $hoy->copy(),
            'id_disciplina' => $this->natacion->id,
            'id_usuario' => $this->cliente->id,
        ]);

        // Pagos: 2 completados (150 + 200 = 350), 1 pendiente (no suma a ingresos)
        BoletaPago::create([
            'numero_boleta' => 'BP-001',
            'fecha_pago' => $hoy->copy()->subDays(2),
            'monto' => 150.00,
            'metodo_pago' => 'Caja Campus',
            'estado' => 'completado',
            'id_formulario' => $solAprob1->id,
        ]);

        BoletaPago::create([
            'numero_boleta' => 'BP-002',
            'fecha_pago' => $hoy->copy()->subDay(),
            'monto' => 200.00,
            'metodo_pago' => 'QR Bancario',
            'estado' => 'completado',
            'id_formulario' => $solAprob2->id,
        ]);

        BoletaPago::create([
            'numero_boleta' => 'BP-003',
            'fecha_pago' => null,
            'monto' => 999.00,
            'metodo_pago' => 'Caja Campus',
            'estado' => 'pendiente',
            'id_formulario' => $solAprob1->id,
        ]);

        // Boletas de inscripción: 2 en Musculación, 1 en Natación
        $insc1 = BoletaInscripcion::create([
            'numero_boleta' => 'INS-001',
            'fecha_inscripcion' => $hoy->toDateString(),
            'fecha_inicio' => $hoy->toDateString(),
            'fecha_fin' => $hoy->copy()->addDays(30)->toDateString(),
            'monto' => 150.00,
            'estado' => 'activo',
            'disciplina' => 'Musculación',
            'id_usuario' => $this->cliente->id,
            'id_disciplina' => $this->musculacion->id,
        ]);

        $insc2 = BoletaInscripcion::create([
            'numero_boleta' => 'INS-002',
            'fecha_inscripcion' => $hoy->toDateString(),
            'fecha_inicio' => $hoy->toDateString(),
            'fecha_fin' => $hoy->copy()->addDays(30)->toDateString(),
            'monto' => 150.00,
            'estado' => 'activo',
            'disciplina' => 'Musculación',
            'id_usuario' => $this->recepcionista->id,
            'id_disciplina' => $this->musculacion->id,
        ]);

        $insc3 = BoletaInscripcion::create([
            'numero_boleta' => 'INS-003',
            'fecha_inscripcion' => $hoy->toDateString(),
            'fecha_inicio' => $hoy->toDateString(),
            'fecha_fin' => $hoy->copy()->addDays(30)->toDateString(),
            'monto' => 200.00,
            'estado' => 'activo',
            'disciplina' => 'Natación',
            'id_usuario' => $this->admin->id,
            'id_disciplina' => $this->natacion->id,
        ]);

        // Aforo en tiempo real hoy:
        // insc1 (Musculación): entrada sin salida => DENTRO (1)
        // insc2 (Musculación): entrada y luego salida => FUERA (0)
        // insc3 (Natación): entrada sin salida => DENTRO (1)
        RegistroEntradaSalida::create([
            'fecha_hora' => $hoy->copy()->setTime(8, 0),
            'tipo' => 'entrada',
            'id_boleta_inscripcion' => $insc1->id,
            'id_usuario' => $this->cliente->id,
        ]);

        RegistroEntradaSalida::create([
            'fecha_hora' => $hoy->copy()->setTime(8, 15),
            'tipo' => 'entrada',
            'id_boleta_inscripcion' => $insc2->id,
            'id_usuario' => $this->recepcionista->id,
        ]);

        RegistroEntradaSalida::create([
            'fecha_hora' => $hoy->copy()->setTime(9, 30),
            'tipo' => 'salida',
            'id_boleta_inscripcion' => $insc2->id,
            'id_usuario' => $this->recepcionista->id,
        ]);

        RegistroEntradaSalida::create([
            'fecha_hora' => $hoy->copy()->setTime(10, 0),
            'tipo' => 'entrada',
            'id_boleta_inscripcion' => $insc3->id,
            'id_usuario' => $this->admin->id,
        ]);
    }

    public function test_cliente_e_instructor_reciben_403_en_bi(): void
    {
        $tokenCliente = $this->cliente->createToken('t')->plainTextToken;
        $tokenInstructor = $this->instructor->createToken('t')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$tokenCliente}")
            ->getJson('/api/bi/resumen')
            ->assertStatus(403);

        $this->withHeader('Authorization', "Bearer {$tokenInstructor}")
            ->getJson('/api/bi/resumen')
            ->assertStatus(403);
    }

    public function test_admin_y_recepcionista_obtienen_resumen_bi_exacto(): void
    {
        $tz = config('app.timezone', 'America/La_Paz');
        $desde = Carbon::now($tz)->subDays(5)->toDateString();
        $hasta = Carbon::now($tz)->toDateString();

        $token = $this->admin->createToken('t')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/bi/resumen?desde={$desde}&hasta={$hasta}");

        $response->assertStatus(200)
            ->assertJsonPath('data.ingresos.total', 350)
            ->assertJsonPath('data.ingresos.cantidad_pagos', 2)
            ->assertJsonPath('data.inscripciones.total', 3)
            ->assertJsonPath('data.aforo_tiempo_real.total_actual', 2)
            ->assertJsonPath('data.solicitudes.total', 4)
            ->assertJsonPath('data.solicitudes.aprobadas', 2)
            ->assertJsonPath('data.solicitudes.pendientes', 1)
            ->assertJsonPath('data.solicitudes.rechazadas', 1);

        // Recepcionista también autorizado
        $tokenRecep = $this->recepcionista->createToken('t')->plainTextToken;
        $this->withHeader('Authorization', "Bearer {$tokenRecep}")
            ->getJson("/api/bi/aforo-tiempo-real")
            ->assertStatus(200)
            ->assertJsonPath('data.total_actual', 2);
    }

    public function test_filtros_por_disciplina_actualizan_series_distribucion_y_movimientos(): void
    {
        $tz = config('app.timezone', 'America/La_Paz');
        $desde = Carbon::now($tz)->subDays(5)->toDateString();
        $hasta = Carbon::now($tz)->toDateString();
        $token = $this->admin->createToken('t')->plainTextToken;

        // Filtrar solo Musculación
        $seriesResp = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/bi/series?desde={$desde}&hasta={$hasta}&id_disciplina={$this->musculacion->id}");

        $seriesResp->assertStatus(200)
            ->assertJsonPath('data.boletas_por_disciplina.0.cantidad_boletas', 2)
            ->assertJsonPath('data.aforo_por_disciplina.0.aforo_actual', 1);

        $distResp = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/bi/distribucion?desde={$desde}&hasta={$hasta}&id_disciplina={$this->musculacion->id}");

        $distResp->assertStatus(200)
            ->assertJsonPath('data.ingresos_por_disciplina.0.monto', 150);

        $movResp = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/bi/movimientos?desde={$desde}&hasta={$hasta}&tipo_detalle=ingresos&per_page=10");

        $movResp->assertStatus(200)
            ->assertJsonPath('meta.total', 2);

        // Verificar UNION ALL con tipo_detalle=todos, búsqueda y ordenamiento
        $unionResp = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/bi/movimientos?desde={$desde}&hasta={$hasta}&tipo_detalle=todos&sort_by=monto&sort_dir=desc&per_page=15");

        $unionResp->assertStatus(200)
            ->assertJsonPath('meta.total', 9); // 2 ingresos + 3 inscripciones + 4 solicitudes

        // Verificar endpoint de exportación completo
        $exportResp = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/bi/exportar-datos?desde={$desde}&hasta={$hasta}");

        $exportResp->assertStatus(200)
            ->assertJsonPath('data.resumen.ingresos.total', 350)
            ->assertJsonCount(9, 'data.movimientos');
    }
}
