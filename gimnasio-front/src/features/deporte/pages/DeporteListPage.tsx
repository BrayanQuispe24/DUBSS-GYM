// src/features/deporte/pages/DeporteListPage.tsx
import React, { useState } from 'react';
import { FaBasketball, FaPlus } from 'react-icons/fa6';
import { useDisciplinas, useCreateDisciplina, useUpdateDisciplina, useDeleteDisciplina } from '../hooks/useDeporte';
import type { Disciplina } from '../services/deporteService';
import DisciplinaTable from '../components/DisciplinaTable';
import DisciplinaFormModal from '../components/DisciplinaFormModal';
import HorarioAssignModal from '../components/HorarioAssignModal';
import DisciplinaDetailModal from '../components/DisciplinaDetailModal';

const DeporteListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHorariosModalOpen, setIsHorariosModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);

  const { data: disciplinas = [], isLoading } = useDisciplinas();
  const createMutation = useCreateDisciplina();
  const updateMutation = useUpdateDisciplina();
  const deleteMutation = useDeleteDisciplina();

  const handleOpenCreate = () => {
    setSelectedDisciplina(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: Disciplina) => {
    setSelectedDisciplina(d);
    setIsModalOpen(true);
  };

  const handleOpenView = (d: Disciplina) => {
    setSelectedDisciplina(d);
    setIsDetailModalOpen(true);
  };

  const handleOpenHorarios = (d: Disciplina) => {
    setSelectedDisciplina(d);
    setIsHorariosModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta disciplina deportiva?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (selectedDisciplina) {
      updateMutation.mutate(
        { id: selectedDisciplina.id, data },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaBasketball style={{ color: '#003B70' }} /> Disciplinas Deportivas & Horarios
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Catálogo de actividades fitness, artes marciales, musculación y asignación de franjas horarias.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{
            padding: '0.65rem 1.25rem', borderRadius: '8px',
            background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)',
            color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 59, 112, 0.25)', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <FaPlus /> Crear Disciplina
        </button>
      </div>

      <DisciplinaTable
        disciplinas={disciplinas}
        isLoading={isLoading}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onAssignHorario={handleOpenHorarios}
      />

      <DisciplinaFormModal
        isOpen={isModalOpen}
        disciplinaToEdit={selectedDisciplina}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <HorarioAssignModal
        isOpen={isHorariosModalOpen}
        disciplina={selectedDisciplina}
        onClose={() => setIsHorariosModalOpen(false)}
      />

      <DisciplinaDetailModal
        isOpen={isDetailModalOpen}
        disciplina={selectedDisciplina}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenManageHorarios={(d) => {
          setSelectedDisciplina(d);
          setIsHorariosModalOpen(true);
        }}
      />
    </section>
  );
};

export default DeporteListPage;
