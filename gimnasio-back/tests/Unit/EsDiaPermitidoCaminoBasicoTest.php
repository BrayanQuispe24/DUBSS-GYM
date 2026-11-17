<?php

namespace Tests\Unit;

use App\Actions\Acceso\ValidarAccesoQRAction;
use Carbon\Carbon;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use ReflectionMethod;

/**
 * Prueba de caja blanca por camino básico de ValidarAccesoQRAction::esDiaPermitido().
 *
 * Grafo de flujo: 12 nodos, 17 aristas -> V(G) = 17 - 12 + 2 = 7 caminos independientes.
 */
class EsDiaPermitidoCaminoBasicoTest extends TestCase
{
    public static function caminos(): array
    {
        return [
            'C1: sin días configurados (1-2-12)' => [null, '2026-11-18', true],
            'C2: pase libre (1-3-4-12)' => ['Pase libre', '2026-11-22', true],
            'C3: lunes a viernes, miércoles (1-3-5-6-7-12)' => ['Lunes a Viernes', '2026-11-18', true],
            'C4: lunes a viernes, sábado (1-3-5-6-8-11-12)' => ['Lunes a Viernes', '2026-11-21', false],
            'C5: fin de semana, domingo (1-3-5-8-9-10-12)' => ['Fin de semana', '2026-11-22', true],
            'C6: fin de semana, lunes (1-3-5-8-9-11-12)' => ['Fin de semana', '2026-11-16', false],
            'C7: días sueltos, viernes (1-3-5-8-11-12)' => ['Lunes, Miércoles, Viernes', '2026-11-20', true],
        ];
    }

    #[DataProvider('caminos')]
    public function test_camino_basico(?string $dias, string $fecha, bool $esperado): void
    {
        $metodo = new ReflectionMethod(ValidarAccesoQRAction::class, 'esDiaPermitido');
        $resultado = $metodo->invoke(new ValidarAccesoQRAction, $dias, Carbon::parse($fecha.' 08:00:00'));

        $this->assertSame($esperado, $resultado);
    }
}
