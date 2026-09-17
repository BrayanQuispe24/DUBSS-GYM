// src/features/inventario/pages/EquipoListPage.tsx
import React, { useState } from 'react';
import {
  FaBoxesPacking,
  FaPlus,
  FaMagnifyingGlass,
  FaLayerGroup,
  FaBuildingFlag,
  FaTag,
} from 'react-icons/fa6';
import {
  useEquipos,
  useAmbientes,
  useMarcas,
  useCreateMarca,
  useUpdateMarca,
  useDeleteMarca,
  useTipoEquipos,
  useCreateTipoEquipo,
  useUpdateTipoEquipo,
  useDeleteTipoEquipo,
  useCreateEquipo,
  useUpdateEquipo,
  useDeleteEquipo,
} from '../hooks/useInventario';
import type { Equipo, Marca, TipoEquipo } from '../services/inventarioService';
import EquipoFormModal from '../components/EquipoFormModal';
import EquipoDetailModal from '../components/EquipoDetailModal';
import EquipoTable from '../components/EquipoTable';
import TipoEquipoFormModal from '../components/TipoEquipoFormModal';
import TipoEquipoTable from '../components/TipoEquipoTable';
import MarcaFormModal from '../components/MarcaFormModal';
import MarcaTable from '../components/MarcaTable';

const EquipoListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'equipos' | 'tipos' | 'marcas'>('equipos');

  // Modals state
  const [isEquipoFormOpen, setIsEquipoFormOpen] = useState(false);
  const [isEquipoDetailOpen, setIsEquipoDetailOpen] = useState(false);
  const [isTipoFormOpen, setIsTipoFormOpen] = useState(false);
  const [isMarcaFormOpen, setIsMarcaFormOpen] = useState(false);

  // Selected items state
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);
  const [selectedEquipoDetail, setSelectedEquipoDetail] = useState<Equipo | null>(null);
  const [selectedTipo, setSelectedTipo] = useState<TipoEquipo | null>(null);
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterAmbiente, setFilterAmbiente] = useState<string>('todos');

  // Queries
  const { data: equipos = [], isLoading: isLoadingEquipos } = useEquipos();
  const { data: ambientes = [] } = useAmbientes();
  const { data: marcas = [], isLoading: isLoadingMarcas } = useMarcas();
  const { data: tipoEquipos = [], isLoading: isLoadingTipos } = useTipoEquipos();

  // Mutations
  const createEquipoMutation = useCreateEquipo();
  const updateEquipoMutation = useUpdateEquipo();
  const deleteEquipoMutation = useDeleteEquipo();

  const createTipoMutation = useCreateTipoEquipo();
  const updateTipoMutation = useUpdateTipoEquipo();
  const deleteTipoMutation = useDeleteTipoEquipo();

  const createMarcaMutation = useCreateMarca();
  const updateMarcaMutation = useUpdateMarca();
  const deleteMarcaMutation = useDeleteMarca();

  // Handlers - Equipos
  const handleOpenCreateEquipo = () => {
    setSelectedEquipo(null);
    setIsEquipoFormOpen(true);
  };

  const handleOpenEditEquipo = (eq: Equipo) => {
    setSelectedEquipo(eq);
    setIsEquipoFormOpen(true);
  };

  const handleOpenViewEquipo = (eq: Equipo) => {
    setSelectedEquipoDetail(eq);
    setIsEquipoDetailOpen(true);
  };

  const handleDeleteEquipo = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este equipo del inventario?')) {
      deleteEquipoMutation.mutate(id);
    }
  };

  const handleEquipoSubmit = (formData: any) => {
    if (selectedEquipo) {
      updateEquipoMutation.mutate(
        { id: selectedEquipo.id, data: formData },
        { onSuccess: () => setIsEquipoFormOpen(false) }
      );
    } else {
      createEquipoMutation.mutate(formData, {
        onSuccess: () => setIsEquipoFormOpen(false),
      });
    }
  };

  // Handlers - Tipos
  const handleOpenCreateTipo = () => {
    setSelectedTipo(null);
    setIsTipoFormOpen(true);
  };

  const handleOpenEditTipo = (tipo: TipoEquipo) => {
    setSelectedTipo(tipo);
    setIsTipoFormOpen(true);
  };

  const handleDeleteTipo = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría / tipo de equipo?')) {
      deleteTipoMutation.mutate(id);
    }
  };

  const handleTipoSubmit = (formData: any) => {
    if (selectedTipo) {
      updateTipoMutation.mutate(
        { id: selectedTipo.id, data: formData },
        { onSuccess: () => setIsTipoFormOpen(false) }
      );
    } else {
      createTipoMutation.mutate(formData, {
        onSuccess: () => setIsTipoFormOpen(false),
      });
    }
  };

  // Handlers - Marcas
  const handleOpenCreateMarca = () => {
    setSelectedMarca(null);
    setIsMarcaFormOpen(true);
  };

  const handleOpenEditMarca = (marca: Marca) => {
    setSelectedMarca(marca);
    setIsMarcaFormOpen(true);
  };

  const handleDeleteMarca = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta marca del sistema?')) {
      deleteMarcaMutation.mutate(id);
    }
  };

  const handleMarcaSubmit = (formData: any) => {
    if (selectedMarca) {
      updateMarcaMutation.mutate(
        { id: selectedMarca.id, data: formData },
        { onSuccess: () => setIsMarcaFormOpen(false) }
      );
    } else {
      createMarcaMutation.mutate(formData, {
        onSuccess: () => setIsMarcaFormOpen(false),
      });
    }
  };

  // Filtered Equipos
  const filteredEquipos = equipos.filter((eq) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      eq.nombre.toLowerCase().includes(q) ||
      eq.codigo.toLowerCase().includes(q) ||
      (eq.modelo && eq.modelo.toLowerCase().includes(q)) ||
      (eq.ambiente?.nombre && eq.ambiente.nombre.toLowerCase().includes(q)) ||
      (eq.marca?.nombre && eq.marca.nombre.toLowerCase().includes(q));

    const eqEstadoStr = String(eq.estado ?? 'bueno').toLowerCase();
    const matchesEstado =
      filterEstado === 'todos' ||
      (filterEstado === 'bueno' && ['bueno', 'excelente', 'operativo'].includes(eqEstadoStr)) ||
      (filterEstado === 'regular' && ['regular', 'revisión'].includes(eqEstadoStr)) ||
      (filterEstado === 'mantenimiento' && ['mantenimiento', 'en mantenimiento'].includes(eqEstadoStr)) ||
      (filterEstado === 'baja' && ['baja', 'dado de baja'].includes(eqEstadoStr));

    const matchesAmbiente =
      filterAmbiente === 'todos' || String(eq.id_ambiente) === String(filterAmbiente);

    return matchesSearch && matchesEstado && matchesAmbiente;
  });

  return (
    <section>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaBoxesPacking style={{ color: '#003B70' }} /> Inventario de Equipos y Máquinas
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Control de activos fijos, categorización por tipo, fabricantes y disponibilidad en salas.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeTab === 'equipos' && (
            <button
              onClick={handleOpenCreateEquipo}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 59, 112, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <FaPlus /> Registrar Equipo
            </button>
          )}

          {activeTab === 'tipos' && (
            <button
              onClick={handleOpenCreateTipo}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 59, 112, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <FaPlus /> Registrar Categoría / Tipo
            </button>
          )}

          {activeTab === 'marcas' && (
            <button
              onClick={handleOpenCreateMarca}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 59, 112, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <FaPlus /> Registrar Marca
            </button>
          )}
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveTab('equipos')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '6px 6px 0 0',
            border: 'none',
            backgroundColor: activeTab === 'equipos' ? '#003B70' : 'transparent',
            color: activeTab === 'equipos' ? '#FFF' : '#64748B',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaBoxesPacking /> Equipos y Máquinas ({equipos.length})
        </button>
        <button
          onClick={() => setActiveTab('tipos')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '6px 6px 0 0',
            border: 'none',
            backgroundColor: activeTab === 'tipos' ? '#003B70' : 'transparent',
            color: activeTab === 'tipos' ? '#FFF' : '#64748B',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaLayerGroup /> Tipos de Equipo ({tipoEquipos.length})
        </button>
        <button
          onClick={() => setActiveTab('marcas')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '6px 6px 0 0',
            border: 'none',
            backgroundColor: activeTab === 'marcas' ? '#003B70' : 'transparent',
            color: activeTab === 'marcas' ? '#FFF' : '#64748B',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaTag /> Marcas ({marcas.length})
        </button>
      </div>

      {/* TAB CONTENT: EQUIPOS */}
      {activeTab === 'equipos' && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1.5rem',
              backgroundColor: '#FFFFFF',
              padding: '0.85rem 1.25rem',
              borderRadius: '12px',
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
                  borderRadius: '8px',
                  padding: '0.5rem 0.85rem',
                  flex: 1,
                }}
              >
                <FaMagnifyingGlass style={{ color: '#94A3B8', fontSize: '0.85rem' }} />
                <input
                  type="text"
                  placeholder="Buscar por código, nombre, modelo o marca..."
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaBuildingFlag style={{ color: '#64748B', fontSize: '0.85rem' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Ambiente:</span>
                <select
                  value={filterAmbiente}
                  onChange={(e) => setFilterAmbiente(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    backgroundColor: '#FFFFFF',
                    color: '#0B1727',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="todos">Todos los Ambientes</option>
                  {ambientes.map((amb) => (
                    <option key={amb.id} value={amb.id}>
                      {amb.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaLayerGroup style={{ color: '#64748B', fontSize: '0.85rem' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Estado:</span>
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
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
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                  <option value="baja">Dado de Baja</option>
                </select>
              </div>
            </div>
          </div>

          <EquipoTable
            equipos={filteredEquipos}
            isLoading={isLoadingEquipos}
            onView={handleOpenViewEquipo}
            onEdit={handleOpenEditEquipo}
            onDelete={handleDeleteEquipo}
          />
        </>
      )}

      {/* TAB CONTENT: TIPOS DE EQUIPO */}
      {activeTab === 'tipos' && (
        <TipoEquipoTable
          tipos={tipoEquipos}
          isLoading={isLoadingTipos}
          onEdit={handleOpenEditTipo}
          onDelete={handleDeleteTipo}
        />
      )}

      {/* TAB CONTENT: MARCAS */}
      {activeTab === 'marcas' && (
        <MarcaTable
          marcas={marcas}
          isLoading={isLoadingMarcas}
          onEdit={handleOpenEditMarca}
          onDelete={handleDeleteMarca}
        />
      )}

      {/* MODALS: EQUIPO */}
      <EquipoFormModal
        isOpen={isEquipoFormOpen}
        equipoToEdit={selectedEquipo}
        ambientes={ambientes}
        marcas={marcas}
        tipoEquipos={tipoEquipos}
        onClose={() => setIsEquipoFormOpen(false)}
        onSubmit={handleEquipoSubmit}
        isPending={createEquipoMutation.isPending || updateEquipoMutation.isPending}
      />

      <EquipoDetailModal
        isOpen={isEquipoDetailOpen}
        equipo={selectedEquipoDetail}
        onClose={() => setIsEquipoDetailOpen(false)}
      />

      {/* MODALS: TIPO EQUIPO */}
      <TipoEquipoFormModal
        isOpen={isTipoFormOpen}
        tipoToEdit={selectedTipo}
        onClose={() => setIsTipoFormOpen(false)}
        onSubmit={handleTipoSubmit}
        isPending={createTipoMutation.isPending || updateTipoMutation.isPending}
      />

      {/* MODALS: MARCA */}
      <MarcaFormModal
        isOpen={isMarcaFormOpen}
        marcaToEdit={selectedMarca}
        onClose={() => setIsMarcaFormOpen(false)}
        onSubmit={handleMarcaSubmit}
        isPending={createMarcaMutation.isPending || updateMarcaMutation.isPending}
      />
    </section>
  );
};

export default EquipoListPage;
