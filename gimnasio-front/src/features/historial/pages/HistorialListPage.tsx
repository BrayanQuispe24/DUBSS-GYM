// src/features/historial/pages/HistorialListPage.tsx
import React, { useState } from 'react';
import { FaNotesMedical, FaPlus, FaMagnifyingGlass } from 'react-icons/fa6';
import { useHistoriales, useCreateHistorial, useUpdateHistorial, useDeleteHistorial } from '../hooks/useHistorial';
import type { Historial } from '../services/historialService';
import HistorialTable from '../components/HistorialTable';
import HistorialFormModal from '../components/HistorialFormModal';
import DetalleHistorialModal from '../components/DetalleHistorialModal';
import AntecedenteModal from '../components/AntecedenteModal';
import HistorialPhysicalViewModal from '../components/HistorialPhysicalViewModal';
import FormularioDUBSSModal from '../components/FormularioDUBSSModal';

const HistorialListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [isAntecedenteModalOpen, setIsAntecedenteModalOpen] = useState(false);
  const [isPhysicalViewModalOpen, setIsPhysicalViewModalOpen] = useState(false);
  const [isDubssModalOpen, setIsDubssModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedHistorial, setSelectedHistorial] = useState<Historial | null>(null);
  const [selectedHistorialForDetalle, setSelectedHistorialForDetalle] = useState<Historial | null>(null);
  const [selectedHistorialForAntecedente, setSelectedHistorialForAntecedente] = useState<Historial | null>(null);
  const [selectedHistorialForPhysicalView, setSelectedHistorialForPhysicalView] = useState<Historial | null>(null);
  const [selectedHistorialForDubss, setSelectedHistorialForDubss] = useState<Historial | null>(null);

  const { data: historiales = [], isLoading } = useHistoriales();
  const createHistorialMutation = useCreateHistorial();
  const updateHistorialMutation = useUpdateHistorial();
  const deleteHistorialMutation = useDeleteHistorial();

  const filteredHistoriales = historiales.filter((h) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const userName = (h.usuario?.name || [h.usuario?.nombre, h.usuario?.apellido].filter(Boolean).join(' ') || '').toLowerCase();
    const userEmail = (h.usuario?.email || '').toLowerCase();
    const userRu = (h.usuario?.registro_universitario || h.usuario?.codigo || '').toLowerCase();
    const facultad = (h.facultad_carrera || '').toLowerCase();
    const obs = (h.observaciones_generales || h.observaciones || '').toLowerCase();

    return userName.includes(query) || userEmail.includes(query) || userRu.includes(query) || facultad.includes(query) || obs.includes(query);
  });

  const handleOpenCreate = () => {
    setSelectedHistorial(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (h: Historial) => {
    setSelectedHistorial(h);
    setIsModalOpen(true);
  };

  const handleOpenDetalle = (h: Historial) => {
    setSelectedHistorialForDetalle(h);
    setIsDetalleModalOpen(true);
  };

  const handleOpenAntecedente = (h: Historial) => {
    setSelectedHistorialForAntecedente(h);
    setIsAntecedenteModalOpen(true);
  };

  const handleOpenPhysicalView = (h: Historial) => {
    setSelectedHistorialForPhysicalView(h);
    setIsPhysicalViewModalOpen(true);
  };

  const handleOpenDubssForm = (h: Historial) => {
    setSelectedHistorialForDubss(h);
    setIsDubssModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este historial médico/deportivo?')) {
      deleteHistorialMutation.mutate(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (selectedHistorial) {
      updateHistorialMutation.mutate(
        { id: selectedHistorial.id, data },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createHistorialMutation.mutate(data, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaNotesMedical style={{ color: '#003B70' }} /> Historial Clínico y Deportivo
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Seguimiento antropométrico, antecedentes médicos y evaluaciones físicas del universitario UAGRM.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{
            padding: '0.55rem 1rem', borderRadius: '4px',
            background: '#0077D4',
            color: '#FFFFFF', border: '1px solid #005FA8', fontWeight: 700, fontSize: '0.80rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em'
          }}
        >
          <FaPlus /> Abrir Historial
        </button>
      </div>

      {/* BARRA DE BUSQUEDA / FILTRADO POR SOCIO */}
      <div style={{ marginBottom: '1.25rem', position: 'relative', maxWidth: '450px' }}>
        <FaMagnifyingGlass style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.85rem' }} />
        <input
          type="text"
          placeholder="Buscar historial por Socio (Nombre, R.U., Email) o Diagnóstico..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%', padding: '0.55rem 0.85rem 0.55rem 2.25rem', borderRadius: '4px',
            border: '1px solid #CBD5E1', backgroundColor: '#FFF', fontSize: '0.82rem'
          }}
        />
      </div>

      <HistorialTable
        historiales={filteredHistoriales}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onAddDetalle={handleOpenDetalle}
        onAddAntecedente={handleOpenAntecedente}
        onViewPhysical={handleOpenPhysicalView}
        onViewDubssForm={handleOpenDubssForm}
      />

      <HistorialFormModal
        isOpen={isModalOpen}
        historialToEdit={selectedHistorial}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isPending={createHistorialMutation.isPending || updateHistorialMutation.isPending}
      />

      <DetalleHistorialModal
        isOpen={isDetalleModalOpen}
        historial={selectedHistorialForDetalle}
        onClose={() => setIsDetalleModalOpen(false)}
      />

      <AntecedenteModal
        isOpen={isAntecedenteModalOpen}
        historial={selectedHistorialForAntecedente}
        onClose={() => setIsAntecedenteModalOpen(false)}
      />

      <HistorialPhysicalViewModal
        isOpen={isPhysicalViewModalOpen}
        historial={selectedHistorialForPhysicalView}
        onClose={() => setIsPhysicalViewModalOpen(false)}
      />

      <FormularioDUBSSModal
        isOpen={isDubssModalOpen}
        historial={selectedHistorialForDubss}
        onClose={() => setIsDubssModalOpen(false)}
      />
    </section>
  );
};

export default HistorialListPage;
