<?php

namespace Tests\Feature;

use App\Models\BoletaInscripcion;
use App\Models\Disciplina;
use App\Models\DisciplinaHorario;
use App\Models\Horario;
use App\Models\Plan;
use App\Models\RegistroEntradaSalida;
use App\Models\Rol;
use App\Models\Tarifa;
use App\Models\Usuario;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PublicLandingTest extends TestCase
{
    use RefreshDatabase;

    public function test_endpoint_publico_landing_retorna_catalogo_y_estadisticas_sin_autenticacion(): void
    {
        $rolCliente = Rol::create(['nombre' => 'Cliente', 'estado' => true]);
        $rolInstructor = Rol::create(['nombre' => 'Instructor', 'estado' => true]);

        $estudiante = Usuario::create([
            'codigo' => '219001122',
            'nombre' => 'Ana',
            'apellido' => 'Perez',
            'email' => 'ana.secreto@uagrm.edu.bo',
            'ci' => '9988776',
            'celular' => '70011223',
            'tipo_usuario' => 'estudiante',
            'estado' => true,
            'password' => Hash::make('password123'),
            'id_rol' => $rolCliente->id,
        ]);

        Usuario::create([
            'codigo' => 'DOC100',
            'nombre' => 'Luis',
            'apellido' => 'Gomez',
            'email' => 'luis.secreto@uagrm.edu.bo',
            'tipo_usuario' => 'docente',
            'estado' => true,
            'password' => Hash::make('password123'),
            'id_rol' => $rolCliente->id,
        ]);

        Usuario::create([
            'nombre' => 'Coach',
            'apellido' => 'Uno',
            'email' => 'coach@uagrm.edu.bo',
            'estado' => true,
            'password' => Hash::make('password123'),
            'id_rol' => $rolInstructor->id,
        ]);

        $boxeo = Disciplina::create([
            'nombre' => 'Boxeo',
            'cantidad_cupos' => 25,
            'estado' => 'activo',
        ]);

        Disciplina::create([
            'nombre' => 'Disciplina Inactiva',
            'cantidad_cupos' => 15,
            'estado' => 'inactivo',
        ]);

        $horario = Horario::create([
            'dia_semana' => 'Lunes - Miércoles - Viernes',
            'hora_inicio' => '18:00:00',
            'hora_fin' => '19:30:00',
        ]);

        $dh = DisciplinaHorario::create([
            'id_disciplina' => $boxeo->id,
            'id_horario' => $horario->id,
            'cupo_maximo' => 20,
            'estado' => true,
        ]);

        $tarifaActiva = Tarifa::create([
            'nombre' => 'Tarifa Estudiante',
            'precio' => 50,
            'estado' => true,
        ]);

        $tarifaInactiva = Tarifa::create([
            'nombre' => 'Tarifa Expirada',
            'precio' => 999,
            'estado' => false,
        ]);

        Plan::create([
            'nombre' => 'Membresía Estudiantes',
            'descripcion' => 'Acceso mensual subvencionado',
            'duracion_dias' => 30,
            'estado' => true,
            'id_tarifa' => $tarifaActiva->id,
        ]);

        Plan::create([
            'nombre' => 'Plan Oculto',
            'descripcion' => 'No debe salir',
            'duracion_dias' => 30,
            'estado' => true,
            'id_tarifa' => $tarifaInactiva->id,
        ]);

        $boleta = BoletaInscripcion::create([
            'numero_boleta' => 'BOL-1001',
            'fecha_inscripcion' => now()->toDateString(),
            'fecha_inicio' => now()->toDateString(),
            'fecha_fin' => now()->addDays(30)->toDateString(),
            'monto' => 50,
            'estado' => 'activo',
            'disciplina' => 'Boxeo',
            'id_disciplina' => $boxeo->id,
            'id_disciplina_horario' => $dh->id,
            'id_tarifa' => $tarifaActiva->id,
            'id_usuario' => $estudiante->id,
        ]);

        RegistroEntradaSalida::create([
            'tipo' => 'entrada',
            'fecha_hora' => Carbon::now(config('app.timezone', 'America/La_Paz'))->toDateTimeString(),
            'id_usuario' => $estudiante->id,
            'id_boleta_inscripcion' => $boleta->id,
        ]);

        $response = $this->getJson('/api/public/landing');

        $response->assertStatus(200)
            ->assertJsonPath('data.disciplinas.0.nombre', 'Boxeo')
            ->assertJsonPath('data.disciplinas.0.total_cupos_ocupados', 1)
            ->assertJsonPath('data.disciplinas.0.total_cupos_disponibles', 24)
            ->assertJsonPath('data.disciplinas.0.horarios.0.cupos_ocupados', 1)
            ->assertJsonPath('data.disciplinas.0.horarios.0.cupos_disponibles', 19)
            ->assertJsonCount(1, 'data.disciplinas')
            ->assertJsonCount(1, 'data.planes')
            ->assertJsonPath('data.planes.0.nombre', 'Membresía Estudiantes')
            ->assertJsonPath('data.planes.0.tarifa.precio', 50)
            ->assertJsonPath('data.estadisticas.estudiantes_activos', 1)
            ->assertJsonPath('data.estadisticas.docentes_admin_activos', 1)
            ->assertJsonPath('data.estadisticas.instructores_activos', 1)
            ->assertJsonPath('data.estadisticas.total_disciplinas_activas', 1)
            ->assertJsonPath('data.estadisticas.aforo_actual', 1);

        $raw = $response->getContent();
        $this->assertStringNotContainsString('ana.secreto@uagrm.edu.bo', $raw);
        $this->assertStringNotContainsString('9988776', $raw);
        $this->assertStringNotContainsString('70011223', $raw);
    }
}
