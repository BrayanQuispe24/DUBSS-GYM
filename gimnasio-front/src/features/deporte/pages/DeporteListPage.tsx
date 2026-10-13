// src/features/deporte/pages/DeporteListPage.tsx
import React, { useState } from 'react';
import { FaBasketball, FaPlus } from 'react-icons/fa6';
import { useAuthStore } from '@/store/authStore';
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

  const { user } = useAuthStore();
  const isAdmin = user?.rol === 'administrador';

  const { data: disciplinas = [], isLoading } = useDisciplinas();
  const createMutation = useCreateDisciplina();
  const updateMutation = useUpdateDisciplina();
  const deleteMutation = useDeleteDisciplina();

  const handleOpenCreate = () => {
    if (!isAdmin) return;
    setSelectedDisciplina(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: Disciplina) => {
    if (!isAdmin) return;
    setSelectedDisciplina(d);
    setIsModalOpen(true);
  };

  const handleOpenView = (d: Disciplina) => {
    setSelectedDisciplina(d);
    setIsDetailModalOpen(true);
  };

  const handleOpenHorarios = (d: Disciplina) => {
    if (!isAdmin) return;
    setSelectedDisciplina(d);
    setIsHorariosModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!isAdmin) return;
    if (window.confirm('¿Está seguro de eliminar esta disciplina deportiva?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (!isAdmin) return;
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
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            style={{
              padding: '0.55rem 1rem', borderRadius: '4px',
              background: '#0077D4', color: '#FFFFFF', border: '1px solid #005FA8',
              fontWeight: 700, fontSize: '0.80rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              textTransform: 'uppercase', letterSpacing: '0.03em'
            }}
          >
            <FaPlus /> Crear Disciplina
          </button>
        )}
      </div>

      <DisciplinaTable
        disciplinas={disciplinas}
        isLoading={isLoading}
        isAdmin={isAdmin}
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
