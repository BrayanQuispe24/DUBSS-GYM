// src/features/inventario/pages/AmbienteListPage.tsx
import React, { useState } from 'react';
import {
  FaBuildingFlag,
  FaPlus,
  FaMagnifyingGlass,
  FaLayerGroup,
} from 'react-icons/fa6';
import {
  useAmbientes,
  useCreateAmbiente,
  useUpdateAmbiente,
  useDeleteAmbiente,
} from '../hooks/useInventario';
import { useAuthStore } from '@/store/authStore';
import type { Ambiente } from '../services/inventarioService';
import AmbienteFormModal from '../components/AmbienteFormModal';
import AmbienteDetailModal from '../components/AmbienteDetailModal';
import AmbienteTable from '../components/AmbienteTable';

const AmbienteListPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol === 'administrador';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAmbiente, setSelectedAmbiente] = useState<Ambiente | null>(null);
  const [selectedAmbienteForDetail, setSelectedAmbienteForDetail] = useState<Ambiente | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  const { data: ambientes = [], isLoading } = useAmbientes();

  const createMutation = useCreateAmbiente();
  const updateMutation = useUpdateAmbiente();
  const deleteMutation = useDeleteAmbiente();

  const handleOpenCreate = () => {
    if (!isAdmin) return;
    setSelectedAmbiente(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (amb: Ambiente) => {
    if (!isAdmin) return;
    setSelectedAmbiente(amb);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (amb: Ambiente) => {
    setSelectedAmbienteForDetail(amb);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!isAdmin) return;
    if (window.confirm('¿Está seguro de eliminar este ambiente del sistema?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (formData: any) => {
    if (!isAdmin) return;
    if (selectedAmbiente) {
      updateMutation.mutate(
        { id: selectedAmbiente.id, data: formData },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const filteredAmbientes = ambientes.filter((amb) => {
    const matchesSearch =
      amb.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (amb.descripcion && amb.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

    const ambEstadoStr = String(amb.estado ?? 'disponible').toLowerCase();
    const matchesEstado =
      filterEstado === 'todos' ||
      (filterEstado === 'disponible' && (ambEstadoStr === 'disponible' || ambEstadoStr === '1' || ambEstadoStr === 'true')) ||
      (filterEstado === 'mantenimiento' && ambEstadoStr === 'mantenimiento') ||
      (filterEstado === 'inactivo' && (ambEstadoStr === 'inactivo' || ambEstadoStr === '0' || ambEstadoStr === 'false'));

    return matchesSearch && matchesEstado;
  });

  return (
    <section>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaBuildingFlag style={{ color: '#003B70' }} /> Ambientes & Espacios UAGRM
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Salas de musculación, áreas de cardio, áreas funcionales y espacios acondicionados.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '4px',
              backgroundColor: '#0077D4',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <FaPlus /> Registrar Ambiente
          </button>
        )}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem',
          backgroundColor: '#FFFFFF',
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          border: '1px solid #E2E8F0',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              padding: '0.45rem 0.75rem',
              flex: 1,
            }}
          >
            <FaMagnifyingGlass style={{ color: '#94A3B8', fontSize: '0.85rem' }} />
            <input
              type="text"
              placeholder="Buscar ambiente por nombre o ubicación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '0.85rem',
                width: '100%',
                backgroundColor: 'transparent',
                color: '#0B1727',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaLayerGroup style={{ color: '#64748B', fontSize: '0.85rem' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Filtrar Estado:</span>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              fontSize: '0.82rem',
              fontWeight: 600,
              backgroundColor: '#FFFFFF',
              color: '#0B1727',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="todos">Todos los Estados</option>
            <option value="disponible">Disponible</option>
            <option value="mantenimiento">En Mantenimiento</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* AMBIENTE TABLE */}
      <AmbienteTable
        ambientes={filteredAmbientes}
        isLoading={isLoading}
        isAdmin={isAdmin}
        onView={handleOpenDetail}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* FORM MODAL */}
      <AmbienteFormModal
        isOpen={isModalOpen}
        ambienteToEdit={selectedAmbiente}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* DETAIL MODAL */}
      <AmbienteDetailModal
        isOpen={isDetailModalOpen}
        ambiente={selectedAmbienteForDetail}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </section>
  );
};

export default AmbienteListPage;
