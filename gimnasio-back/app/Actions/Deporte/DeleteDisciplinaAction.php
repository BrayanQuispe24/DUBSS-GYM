<?php

namespace App\Actions\Deporte;

use App\Models\Disciplina;

class DeleteDisciplinaAction
{
    public function execute(int $id): bool
    {
        $disciplina = Disciplina::findOrFail($id);
        return (bool) $disciplina->delete();
    }
}
