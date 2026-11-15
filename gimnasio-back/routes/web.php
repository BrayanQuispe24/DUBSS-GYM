<?php

use App\Http\Controllers\IntegracionNotificacionController;
use App\Http\Controllers\TelegramIntegracionController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Alias directos para integraciones (permite llamadas con o sin prefijo /api, o directo a /api)
Route::post('/integraciones/telegram/vincular', [TelegramIntegracionController::class, 'vincular']);
Route::post('/integraciones/notificaciones/registrar', [IntegracionNotificacionController::class, 'registrar']);
Route::post('/api', [TelegramIntegracionController::class, 'vincular']);
Route::post('/api/', [TelegramIntegracionController::class, 'vincular']);
