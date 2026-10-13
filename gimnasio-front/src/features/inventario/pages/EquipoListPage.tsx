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
import { useAuthStore } from '@/store/authStore';

const EquipoListPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol === 'administrador';

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
    if (!isAdmin) return;
    setSelectedEquipo(null);
    setIsEquipoFormOpen(true);
  };

  const handleOpenEditEquipo = (eq: Equipo) => {
    if (!isAdmin) return;
    setSelectedEquipo(eq);
    setIsEquipoFormOpen(true);
  };

  const handleOpenViewEquipo = (eq: Equipo) => {
    setSelectedEquipoDetail(eq);
    setIsEquipoDetailOpen(true);
  };

  const handleDeleteEquipo = (id: number) => {
    if (!isAdmin) return;
    if (window.confirm('¿Está seguro de eliminar este equipo del inventario?')) {
      deleteEquipoMutation.mutate(id);
    }
  };

  const handleEquipoSubmit = (formData: any) => {
    if (!isAdmin) return;
    if (selectedEquipo) {
      updateEquipoMutation.mutate(
        { id: selectedEquipo.id, data: formData },
        {
          onSuccess: () => {
            setIsEquipoFormOpen(false);
            setSelectedEquipo(null);
          },
          onError: () => {
            setIsEquipoFormOpen(false);
            setSelectedEquipo(null);
          },
        }
      );
    } else {
      createEquipoMutation.mutate(formData, {
        onSuccess: () => {
          setIsEquipoFormOpen(false);
          setSelectedEquipo(null);
        },
      });
    }
  };

  // Handlers - Tipos
  const handleOpenCreateTipo = () => {
    if (!isAdmin) return;
    setSelectedTipo(null);
    setIsTipoFormOpen(true);
  };

  const handleOpenEditTipo = (tipo: TipoEquipo) => {
    if (!isAdmin) return;
    setSelectedTipo(tipo);
    setIsTipoFormOpen(true);
  };

  const handleDeleteTipo = (id: number) => {
    if (!isAdmin) return;
    if (window.confirm('¿Está seguro de eliminar esta categoría / tipo de equipo?')) {
      deleteTipoMutation.mutate(id);
    }
  };

  const handleTipoSubmit = (formData: any) => {
    if (!isAdmin) return;
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
    if (!isAdmin) return;
    setSelectedMarca(null);
    setIsMarcaFormOpen(true);
  };

  const handleOpenEditMarca = (marca: Marca) => {
    if (!isAdmin) return;
    setSelectedMarca(marca);
    setIsMarcaFormOpen(true);
  };

  const handleDeleteMarca = (id: number) => {
    if (!isAdmin) return;
    if (window.confirm('¿Está seguro de eliminar esta marca del sistema?')) {
      deleteMarcaMutation.mutate(id);
    }
  };

  const handleMarcaSubmit = (formData: any) => {
    if (!isAdmin) return;
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

    const isVigente =
      eq.estado === true ||
      ['1', 'true', 'bueno', 'operativo', 'vigente'].includes(
        String(eq.estado ?? '').toLowerCase()
      );

    const matchesAmbiente =
      filterAmbiente === 'todos' || String(eq.id_ambiente) === String(filterAmbiente);

    return matchesSearch && isVigente && matchesAmbiente;
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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isAdmin && activeTab === 'equipos' && (
            <button
              onClick={handleOpenCreateEquipo}
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
              <FaPlus /> Registrar Equipo
            </button>
          )}

          {isAdmin && activeTab === 'tipos' && (
            <button
              onClick={handleOpenCreateTipo}
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
              <FaPlus /> Registrar Categoría / Tipo
            </button>
          )}

          {isAdmin && activeTab === 'marcas' && (
            <button
              onClick={handleOpenCreateMarca}
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
              <FaPlus /> Registrar Marca
            </button>
          )}
        </div>
      </div>

      {/* ENTERPRISE TABS SELECTOR */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0' }}>
        <button
          onClick={() => setActiveTab('equipos')}
          style={{
            padding: '0.65rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'equipos' ? '2px solid #0077D4' : '2px solid transparent',
            color: activeTab === 'equipos' ? '#0077D4' : '#64748B',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '-1px',
            transition: 'all 0.15s ease',
          }}
        >
          <FaBoxesPacking size={14} /> Equipos y Máquinas ({equipos.length})
        </button>
        <button
          onClick={() => setActiveTab('tipos')}
          style={{
            padding: '0.65rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'tipos' ? '2px solid #0077D4' : '2px solid transparent',
            color: activeTab === 'tipos' ? '#0077D4' : '#64748B',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '-1px',
            transition: 'all 0.15s ease',
          }}
        >
          <FaLayerGroup size={14} /> Tipos de Equipo ({tipoEquipos.length})
        </button>
        <button
          onClick={() => setActiveTab('marcas')}
          style={{
            padding: '0.65rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'marcas' ? '2px solid #0077D4' : '2px solid transparent',
            color: activeTab === 'marcas' ? '#0077D4' : '#64748B',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '-1px',
            transition: 'all 0.15s ease',
          }}
        >
          <FaTag size={14} /> Marcas ({marcas.length})
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
                <FaMagnifyingGlass style={{ color: '#94A3B8', fontSize: '0.8rem' }} />
                <input
                  type="text"
                  placeholder="Buscar por código, nombre, modelo o marca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.82rem',
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: '#0B1727',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaBuildingFlag style={{ color: '#64748B', fontSize: '0.82rem' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Ambiente:</span>
                <select
                  value={filterAmbiente}
                  onChange={(e) => setFilterAmbiente(e.target.value)}
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
                  <option value="todos">Todos los Ambientes</option>
                  {ambientes.map((amb) => (
                    <option key={amb.id} value={amb.id}>
                      {amb.nombre}
                    </option>
                  ))}
                </select>
              </div>


            </div>
          </div>

          <EquipoTable
            equipos={filteredEquipos}
            isLoading={isLoadingEquipos}
            isAdmin={isAdmin}
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
          isAdmin={isAdmin}
          onEdit={handleOpenEditTipo}
          onDelete={handleDeleteTipo}
        />
      )}

      {/* TAB CONTENT: MARCAS */}
      {activeTab === 'marcas' && (
        <MarcaTable
          marcas={marcas}
          isLoading={isLoadingMarcas}
          isAdmin={isAdmin}
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
        onClose={() => {
          setIsEquipoFormOpen(false);
          setSelectedEquipo(null);
        }}
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
