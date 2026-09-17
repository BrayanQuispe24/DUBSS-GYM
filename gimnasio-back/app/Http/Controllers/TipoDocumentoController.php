<?php

namespace App\Http\Controllers;

use App\Actions\Documento\CreateTipoDocumentoAction;
use App\Actions\Documento\DeleteTipoDocumentoAction;
use App\Actions\Documento\ListarTipoDocumentosAction;
use App\Actions\Documento\UpdateTipoDocumentoAction;
use App\DTOs\Documento\CreateTipoDocumentoDTO;
use App\DTOs\Documento\UpdateTipoDocumentoDTO;
use App\Http\Requests\Documento\CreateTipoDocumentoRequest;
use App\Http\Requests\Documento\UpdateTipoDocumentoRequest;
use App\Models\TipoDocumento;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TipoDocumentoController extends Controller
{
    public function index(ListarTipoDocumentosAction $action): JsonResponse
    {
        Gate::authorize('viewAny', TipoDocumento::class);
        $tipos = $action->execute();
        return response()->json([
            'message' => 'Tipos de documentos listados exitosamente',
            'data' => $tipos,
        ]);
    }

    public function store(CreateTipoDocumentoRequest $request, CreateTipoDocumentoAction $action): JsonResponse
    {
        Gate::authorize('create', TipoDocumento::class);
        $dto = CreateTipoDocumentoDTO::fromRequest($request);
        $tipo = $action->execute($dto);
        return response()->json([
            'message' => 'Tipo de documento creado exitosamente',
            'data' => $tipo,
        ], 201);
    }

    public function update(UpdateTipoDocumentoRequest $request, UpdateTipoDocumentoAction $action): JsonResponse
    {
        Gate::authorize('update', TipoDocumento::class);
        $dto = UpdateTipoDocumentoDTO::fromRequest($request);
        $tipo = $action->execute($dto);
        return response()->json([
            'message' => 'Tipo de documento actualizado exitosamente',
            'data' => $tipo,
        ]);
    }

    public function destroy(int $id, DeleteTipoDocumentoAction $action): JsonResponse
    {
        Gate::authorize('delete', TipoDocumento::class);
        $action->execute($id);
        return response()->json([
            'message' => 'Tipo de documento eliminado exitosamente',
        ]);
    }
}
