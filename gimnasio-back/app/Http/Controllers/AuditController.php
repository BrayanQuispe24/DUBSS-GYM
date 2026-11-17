<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuditController extends Controller
{
    /**
     * List paginated audit trail logs with comprehensive filters.
     */
    public function index(Request $request): JsonResponse
    {
        // Enforce admin permission
        $user = $request->user();
        if (!$user || !$user->esAdmin()) {
            return response()->json(['message' => 'No autorizado para consultar la bitácora de auditoría.'], 403);
        }

        $query = Audit::with(['user:id,nombre,apellido,email,ci,codigo']);

        // Filter: Event
        if ($request->filled('event')) {
            $query->where('event', '=', $request->input('event'));
        }

        // Filter: Auditable Model Type (e.g. 'Usuario', 'BoletaPago')
        if ($request->filled('auditable_type')) {
            $type = $request->input('auditable_type');
            if (!str_contains($type, '\\')) {
                $query->where('auditable_type', 'LIKE', "%{$type}%");
            } else {
                $query->where('auditable_type', '=', $type);
            }
        }

        // Filter: Specific User ID
        if ($request->filled('user_id')) {
            $query->where('user_id', '=', $request->input('user_id'));
        }

        // Filter: Date Range
        if ($request->filled('fecha_desde')) {
            $query->where('created_at', '>=', Carbon::parse($request->input('fecha_desde'))->startOfDay());
        }
        if ($request->filled('fecha_hasta')) {
            $query->where('created_at', '<=', Carbon::parse($request->input('fecha_hasta'))->endOfDay());
        }

        // Filter: General Search (search in IP, auditable_id, or user name/email)
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'LIKE', "%{$search}%")
                  ->orWhere('auditable_id', '=', is_numeric($search) ? (int)$search : -1)
                  ->orWhere('tags', 'LIKE', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('nombre', 'ILIKE', "%{$search}%")
                         ->orWhere('apellido', 'ILIKE', "%{$search}%")
                         ->orWhere('email', 'ILIKE', "%{$search}%")
                         ->orWhere('ci', 'LIKE', "%{$search}%");
                  });
            });
        }

        $perPage = min((int) $request->input('per_page', 25), 100);
        $audits = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($audits);
    }

    /**
     * Retrieve aggregated statistics for the BI / Audit Analytics tab.
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->esAdmin()) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $now = Carbon::now();
        $todayStart = $now->copy()->startOfDay();

        $totalEvents = Audit::count();
        $eventsToday = Audit::where('created_at', '>=', $todayStart)->count();

        // Counts by Event Type
        $eventCounts = Audit::selectRaw('event, count(*) as total')
            ->groupBy('event')
            ->pluck('total', 'event')
            ->toArray();

        $byType = [
            'created' => (int) ($eventCounts['created'] ?? 0),
            'updated' => (int) ($eventCounts['updated'] ?? 0),
            'deleted' => (int) ($eventCounts['deleted'] ?? 0),
            'login' => (int) ($eventCounts['login'] ?? 0),
            'logout' => (int) ($eventCounts['logout'] ?? 0),
            'other' => 0,
        ];

        foreach ($eventCounts as $ev => $cnt) {
            if (!array_key_exists($ev, $byType) || $ev === 'other') {
                $byType['other'] += (int) $cnt;
            }
        }

        // Daily volume for the last 14 days
        $fourteenDaysAgo = $now->copy()->subDays(13)->startOfDay();
        $dailyRaw = Audit::selectRaw("DATE(created_at) as log_date, count(*) as count")
            ->where('created_at', '>=', $fourteenDaysAgo)
            ->groupBy('log_date')
            ->orderBy('log_date', 'asc')
            ->pluck('count', 'log_date')
            ->toArray();

        $dailyVolume = [];
        for ($i = 13; $i >= 0; $i--) {
            $d = $now->copy()->subDays($i)->format('Y-m-d');
            $dailyVolume[] = [
                'date' => $d,
                'count' => (int) ($dailyRaw[$d] ?? 0),
            ];
        }

        // Top users with most actions (last 30 days)
        $thirtyDaysAgo = $now->copy()->subDays(30)->startOfDay();
        $topUsersRaw = Audit::selectRaw('user_id, count(*) as action_count')
            ->whereNotNull('user_id')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('user_id')
            ->orderBy('action_count', 'desc')
            ->limit(5)
            ->with(['user:id,nombre,apellido,email'])
            ->get();

        $topUsers = [];
        foreach ($topUsersRaw as $item) {
            if ($item->user) {
                $topUsers[] = [
                    'user_id' => $item->user->id,
                    'user_name' => "{$item->user->nombre} {$item->user->apellido}",
                    'user_email' => $item->user->email,
                    'role' => $item->user->rol ?? 'personal',
                    'count' => (int) $item->action_count,
                ];
            }
        }

        // Recent Security Alerts
        $recentAlerts = Audit::whereIn('event', ['failed_attempt', 'qr_scan_rejected'])
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->count();

        return response()->json([
            'total_events' => $totalEvents,
            'events_today' => $eventsToday,
            'events_by_type' => $byType,
            'daily_volume' => $dailyVolume,
            'top_users' => $topUsers,
            'recent_alerts' => $recentAlerts,
        ]);
    }

    /**
     * Streamed export of audit records to CSV.
     */
    public function export(Request $request): StreamedResponse
    {
        $user = $request->user();
        if (!$user || !$user->esAdmin()) {
            abort(403, 'No autorizado.');
        }

        $query = Audit::with(['user:id,nombre,apellido,email']);

        if ($request->filled('event')) {
            $query->where('event', '=', $request->input('event'));
        }
        if ($request->filled('auditable_type')) {
            $type = $request->input('auditable_type');
            $query->where('auditable_type', 'LIKE', "%{$type}%");
        }
        if ($request->filled('fecha_desde')) {
            $query->where('created_at', '>=', Carbon::parse($request->input('fecha_desde'))->startOfDay());
        }
        if ($request->filled('fecha_hasta')) {
            $query->where('created_at', '<=', Carbon::parse($request->input('fecha_hasta'))->endOfDay());
        }

        $filename = 'bitacora_auditoria_' . date('Y-m-d_His') . '.csv';

        return response()->stream(function () use ($query) {
            $handle = fopen('php://output', 'w');
            // Write UTF-8 BOM for Excel compatibility
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($handle, [
                'ID',
                'Fecha_Hora',
                'Evento',
                'Usuario',
                'Email',
                'Entidad',
                'ID_Entidad',
                'IP',
                'URL',
                'Valores_Anteriores',
                'Valores_Nuevos',
            ]);

            $query->orderBy('id', 'desc')->chunk(500, function ($logs) use ($handle) {
                foreach ($logs as $log) {
                    $uName = $log->user ? "{$log->user->nombre} {$log->user->apellido}" : 'Sistema';
                    $uEmail = $log->user ? $log->user->email : '';
                    $entidad = $log->auditable_type ? class_basename($log->auditable_type) : 'Sistema';

                    fputcsv($handle, [
                        $log->id,
                        $log->created_at->format('Y-m-d H:i:s'),
                        $log->event,
                        $uName,
                        $uEmail,
                        $entidad,
                        $log->auditable_id ?? '',
                        $log->ip_address ?? '',
                        $log->url ?? '',
                        is_array($log->old_values) ? json_encode($log->old_values, JSON_UNESCAPED_UNICODE) : '',
                        is_array($log->new_values) ? json_encode($log->new_values, JSON_UNESCAPED_UNICODE) : '',
                    ]);
                }
            });

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
