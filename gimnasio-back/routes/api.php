<?php

use App\Http\Controllers\AnalisisCorporalController;
use App\Http\Controllers\PerfilEntrenamientoController;
use App\Http\Controllers\RecomendacionRutinaController;
use App\Http\Controllers\AmbienteController;
use App\Http\Controllers\AntecedenteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BoletaInscripcionController;
use App\Http\Controllers\BoletaPagoController;
use App\Http\Controllers\DetalleHistorialController;
use App\Http\Controllers\DisciplinaController;
use App\Http\Controllers\DisciplinaHorarioController;
use App\Http\Controllers\DocumentoController;
use App\Http\Controllers\EjercicioController;
use App\Http\Controllers\EjercicioGrupoMuscularController;
use App\Http\Controllers\EjercicioImagenController;
use App\Http\Controllers\EquipoController;
use App\Http\Controllers\FormularioSolicitudController;
use App\Http\Controllers\GrupoMuscularController;
use App\Http\Controllers\HistorialController;
use App\Http\Controllers\HorarioController;
use App\Http\Controllers\MantenimientoController;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\MovimientoInventarioController;
use App\Http\Controllers\PermisoController;
use App\Http\Controllers\PlanAlimentacionController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PlanEntrenamientoController;
use App\Http\Controllers\RegistroEntradaSalidaController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\RolPermisoController;
use App\Http\Controllers\RutinaController;
use App\Http\Controllers\TarifaController;
use App\Http\Controllers\TipoDocumentoController;
use App\Http\Controllers\TipoEjercicioController;
use App\Http\Controllers\TipoEquipoController;
use App\Http\Controllers\TipoMovimientoController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;

// Rutas Públicas de Autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas Protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación & Perfil
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Gestión de Usuarios
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::put('/usuarios', [UsuarioController::class, 'update']);
    Route::patch('/usuarios/estado', [UsuarioController::class, 'updateEstado']);

    // Módulo 1: Seguridad (Roles & Permisos)
    Route::get('/roles', [RolController::class, 'index']);
    Route::post('/roles', [RolController::class, 'store']);
    Route::put('/roles', [RolController::class, 'update']);
    Route::delete('/roles/{id}', [RolController::class, 'destroy']);

    Route::get('/permisos', [PermisoController::class, 'index']);
    Route::post('/permisos', [PermisoController::class, 'store']);
    Route::put('/permisos', [PermisoController::class, 'update']);
    Route::delete('/permisos/{id}', [PermisoController::class, 'destroy']);

    Route::post('/rol-permiso', [RolPermisoController::class, 'store']);

    // Módulo 2: Historial Clínico / Deportivo
    Route::get('/historiales', [HistorialController::class, 'index']);
    Route::post('/historiales', [HistorialController::class, 'store']);
    Route::put('/historiales', [HistorialController::class, 'update']);
    Route::delete('/historiales/{id}', [HistorialController::class, 'destroy']);

    Route::post('/detalle-historial', [DetalleHistorialController::class, 'store']);
    Route::put('/detalle-historial', [DetalleHistorialController::class, 'update']);
    Route::delete('/detalle-historial/{id}', [DetalleHistorialController::class, 'destroy']);

    Route::post('/antecedentes', [AntecedenteController::class, 'store']);

    // Módulo 3: Documentación & Trámites
    Route::get('/documentos', [DocumentoController::class, 'index']);
    Route::post('/documentos', [DocumentoController::class, 'store']);
    Route::put('/documentos', [DocumentoController::class, 'update']);
    Route::delete('/documentos/{id}', [DocumentoController::class, 'destroy']);

    Route::get('/tipo-documentos', [TipoDocumentoController::class, 'index']);
    Route::post('/tipo-documentos', [TipoDocumentoController::class, 'store']);
    Route::put('/tipo-documentos', [TipoDocumentoController::class, 'update']);
    Route::delete('/tipo-documentos/{id}', [TipoDocumentoController::class, 'destroy']);

    Route::patch('/formulario-solicitudes/{id}/estado', [FormularioSolicitudController::class, 'updateEstado']);
    Route::apiResource('formulario-solicitudes', FormularioSolicitudController::class);
    Route::post('/boletas-pago/{id}/emitir-inscripcion', [BoletaPagoController::class, 'emitirInscripcion']);
    Route::apiResource('boletas-pago', BoletaPagoController::class);
    Route::get('/boletas-inscripcion/{id}/qr', [BoletaInscripcionController::class, 'generarQR']);
    Route::apiResource('boletas-inscripcion', BoletaInscripcionController::class);

    // Módulo 4: Deporte, Planes & Horarios
    Route::apiResource('disciplinas', DisciplinaController::class);
    Route::apiResource('horarios', HorarioController::class);
    Route::get('/disciplina-horario', [DisciplinaHorarioController::class, 'index']);
    Route::post('/disciplina-horario', [DisciplinaHorarioController::class, 'store']);
    Route::delete('/disciplina-horario/{id}', [DisciplinaHorarioController::class, 'destroy']);

    Route::apiResource('tarifas', TarifaController::class);
    Route::apiResource('planes', PlanController::class);

    // Módulo 5: Ejercicios, Rutinas & Entrenamiento (IA)
    Route::apiResource('tipo-ejercicios', TipoEjercicioController::class);
    Route::apiResource('ejercicios', EjercicioController::class);
    Route::get('/ejercicios/{id_ejercicio}/imagenes', [EjercicioImagenController::class, 'index']);
    Route::post('/ejercicios/{id_ejercicio}/imagenes', [EjercicioImagenController::class, 'store']);
    Route::delete('/ejercicio-imagenes/{id}', [EjercicioImagenController::class, 'destroy']);
    Route::apiResource('grupo-musculares', GrupoMuscularController::class);
    Route::post('/ejercicio-grupo-muscular', [EjercicioGrupoMuscularController::class, 'store']);
    Route::delete('/ejercicio-grupo-muscular/{id}', [EjercicioGrupoMuscularController::class, 'destroy']);
    Route::apiResource('rutinas', RutinaController::class);
    Route::apiResource('plan-entrenamientos', PlanEntrenamientoController::class);

    // Módulo IA: Análisis Corporal & Recomendación Experta
    Route::get('/analisis-corporales', [AnalisisCorporalController::class, 'index']);
    Route::get('/analisis-corporales/{id}', [AnalisisCorporalController::class, 'show']);
    Route::post('/analisis-corporales', [AnalisisCorporalController::class, 'store']);

    Route::get('/perfil-entrenamiento', [PerfilEntrenamientoController::class, 'show']);
    Route::post('/perfil-entrenamiento', [PerfilEntrenamientoController::class, 'storeOrUpdate']);

    Route::post('/recomendaciones/rutinas', [RecomendacionRutinaController::class, 'generarRutina']);
    Route::get('/usuarios/{id}/rutinas', [RecomendacionRutinaController::class, 'obtenerRutinasUsuario']);

    // Módulo 6: Nutrición
    Route::apiResource('plan-alimentacion', PlanAlimentacionController::class);

    // Módulo 7: Espacios
    Route::apiResource('ambientes', AmbienteController::class);

    // Módulo 8: Control de Accesos & Asistencia
    Route::post('/registro-accesos/validar-qr', [RegistroEntradaSalidaController::class, 'validarQR']);
    Route::apiResource('registro-accesos', RegistroEntradaSalidaController::class);

    // Módulo 9: Inventario & Mantenimiento
    Route::apiResource('marcas', MarcaController::class);
    Route::apiResource('tipo-equipos', TipoEquipoController::class);
    Route::apiResource('equipos', EquipoController::class);
    Route::apiResource('tipo-movimientos', TipoMovimientoController::class);
    Route::get('/movimientos-inventario', [MovimientoInventarioController::class, 'index']);
    Route::post('/movimientos-inventario', [MovimientoInventarioController::class, 'store']);
    Route::apiResource('mantenimientos', MantenimientoController::class);
});
