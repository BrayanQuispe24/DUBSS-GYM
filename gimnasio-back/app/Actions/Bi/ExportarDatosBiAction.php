<?php

namespace App\Actions\Bi;

use Carbon\Carbon;

class ExportarDatosBiAction
{
    public function __construct(
        private readonly ObtenerResumenBiAction $resumenAction,
        private readonly ObtenerSeriesBiAction $seriesAction,
        private readonly ObtenerDistribucionBiAction $distribucionAction,
        private readonly ListarDetalleBiAction $detalleAction,
    ) {}

    public function execute(array $filters, string $generadoPor): array
    {
        $tz = config('app.timezone', 'America/La_Paz');

        return [
            'generado_en' => Carbon::now($tz)->format('Y-m-d H:i:s'),
            'generado_por' => $generadoPor,
            'resumen' => $this->resumenAction->execute($filters),
            'series' => $this->seriesAction->execute($filters),
            'distribucion' => $this->distribucionAction->execute($filters),
            'movimientos' => $this->detalleAction->execute($filters, true),
        ];
    }
}

