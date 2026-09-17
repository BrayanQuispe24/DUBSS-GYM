<?php

namespace App\Http\Controllers;

use App\Actions\Documento\CreateDocumentoAction;
use App\Actions\Documento\DeleteDocumentoAction;
use App\Actions\Documento\ListarDocumentosAction;
use App\Actions\Documento\UpdateDocumentoAction;
use App\DTOs\Documento\CreateDocumentoDTO;
use App\DTOs\Documento\UpdateDocumentoDTO;
use App\Http\Requests\Documento\CreateDocumentoRequest;
use App\Http\Requests\Documento\UpdateDocumentoRequest;
use App\Models\Documento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DocumentoController extends Controller
{
    public function index(Request $request, ListarDocumentosAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Documento::class);
        $documentos = $action->execute($request->user());
        return response()->json([
            'message' => 'Documentos listados exitosamente',
            'data' => $documentos,
        ]);
    }

    public function store(CreateDocumentoRequest $request, CreateDocumentoAction $action): JsonResponse
    {
        Gate::authorize('create', Documento::class);
        $dto = CreateDocumentoDTO::fromRequest($request);
        $documento = $action->execute($dto, $request->user());
        return response()->json([
            'message' => 'Documento cargado exitosamente',
            'data' => $documento,
        ], 201);
    }

    public function update(UpdateDocumentoRequest $request, UpdateDocumentoAction $action): JsonResponse
    {
        $dto = UpdateDocumentoDTO::fromRequest($request);
        $documentoModel = Documento::findOrFail($dto->id);
        Gate::authorize('update', $documentoModel);
        $documento = $action->execute($dto);
        return response()->json([
            'message' => 'Documento actualizado exitosamente',
            'data' => $documento,
        ]);
    }

    public function destroy(int $id, DeleteDocumentoAction $action): JsonResponse
    {
        $documentoModel = Documento::findOrFail($id);
        Gate::authorize('delete', $documentoModel);
        $action->execute($id);
        return response()->json([
            'message' => 'Documento eliminado exitosamente',
        ]);
    }
}
