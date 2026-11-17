<?php

namespace App\Services;

use App\Models\Audit;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as RequestFacade;

class AuditLoggerService
{
    /**
     * Log a successful login event.
     */
    public static function logLogin(Usuario $user, ?Request $request = null): Audit
    {
        $req = $request ?: RequestFacade::instance();

        return Audit::create([
            'user_type' => Usuario::class,
            'user_id' => $user->id,
            'event' => 'login',
            'auditable_type' => Usuario::class,
            'auditable_id' => $user->id,
            'old_values' => null,
            'new_values' => [
                'email' => $user->email,
                'nombre' => $user->name,
                'rol' => $user->rol ?? 'cliente',
                'login_time' => now()->toIso8601String(),
            ],
            'url' => $req ? $req->fullUrl() : '/api/login',
            'ip_address' => $req ? $req->ip() : '127.0.0.1',
            'user_agent' => $req ? substr((string) $req->userAgent(), 0, 1020) : null,
            'tags' => 'seguridad,auth',
        ]);
    }

    /**
     * Log a logout event.
     */
    public static function logLogout(Usuario $user, ?Request $request = null): Audit
    {
        $req = $request ?: RequestFacade::instance();

        return Audit::create([
            'user_type' => Usuario::class,
            'user_id' => $user->id,
            'event' => 'logout',
            'auditable_type' => Usuario::class,
            'auditable_id' => $user->id,
            'old_values' => null,
            'new_values' => [
                'email' => $user->email,
                'logout_time' => now()->toIso8601String(),
            ],
            'url' => $req ? $req->fullUrl() : '/api/logout',
            'ip_address' => $req ? $req->ip() : '127.0.0.1',
            'user_agent' => $req ? substr((string) $req->userAgent(), 0, 1020) : null,
            'tags' => 'seguridad,auth',
        ]);
    }

    /**
     * Log a failed authentication attempt.
     */
    public static function logFailedLogin(string $email, ?string $reason = 'Credenciales inválidas', ?Request $request = null): Audit
    {
        $req = $request ?: RequestFacade::instance();

        return Audit::create([
            'user_type' => null,
            'user_id' => null,
            'event' => 'failed_attempt',
            'auditable_type' => Usuario::class,
            'auditable_id' => null,
            'old_values' => null,
            'new_values' => [
                'attempted_email' => $email,
                'motivo' => $reason,
                'timestamp' => now()->toIso8601String(),
            ],
            'url' => $req ? $req->fullUrl() : '/api/login',
            'ip_address' => $req ? $req->ip() : '127.0.0.1',
            'user_agent' => $req ? substr((string) $req->userAgent(), 0, 1020) : null,
            'tags' => 'seguridad,alerta',
        ]);
    }

    /**
     * Log custom security/system events.
     */
    public static function logCustomEvent(
        string $event,
        string $tags,
        array $data,
        ?Usuario $user = null,
        ?string $auditableType = null,
        ?int $auditableId = null,
        ?Request $request = null
    ): Audit {
        $req = $request ?: RequestFacade::instance();

        return Audit::create([
            'user_type' => $user ? Usuario::class : null,
            'user_id' => $user?->id,
            'event' => $event,
            'auditable_type' => $auditableType,
            'auditable_id' => $auditableId,
            'old_values' => $data['old'] ?? null,
            'new_values' => $data['new'] ?? $data,
            'url' => $req ? $req->fullUrl() : null,
            'ip_address' => $req ? $req->ip() : '127.0.0.1',
            'user_agent' => $req ? substr((string) $req->userAgent(), 0, 1020) : null,
            'tags' => $tags,
        ]);
    }
}

