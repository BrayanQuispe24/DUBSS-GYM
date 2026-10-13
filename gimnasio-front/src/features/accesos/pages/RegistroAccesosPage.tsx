// src/features/accesos/pages/RegistroAccesosPage.tsx
import React, { useState } from 'react';
import { FaRightToBracket, FaRightFromBracket, FaUserCheck, FaClock, FaQrcode, FaExpand } from 'react-icons/fa6';
import { useRegistrosAcceso, useCreateRegistroAcceso } from '../hooks/useAccesos';
import EscanerQRModal from '../components/EscanerQRModal';
import api from '@/services/api';

const RegistroAccesosPage: React.FC = () => {
  const { data: registros = [], isLoading } = useRegistrosAcceso();
  const createMutation = useCreateRegistroAcceso();

  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; apellido: string; ci?: string; codigo?: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | ''>('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  React.useEffect(() => {
    api.get('/usuarios').then((r) => setUsuarios(r.data.data)).catch(() => {});
  }, []);

  const handleMarcacion = (tipo: 'entrada' | 'salida') => {
    if (!selectedUser) return;
    createMutation.mutate({
      tipo,
      id_usuario: Number(selectedUser),
    }, {
      onSuccess: () => setSelectedUser('')
    });
  };

  const filteredRegistros = registros.filter((r) => {
    const text = `${r.usuario?.nombre || ''} ${r.usuario?.apellido || ''} ${r.usuario?.ci || ''} ${r.usuario?.codigo || ''}`.toLowerCase();
    return text.includes(searchFilter.toLowerCase());
  });

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaQrcode style={{ color: '#003B70' }} /> Garita & Control de Marcaciones en Tiempo Real
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Monitoreo de entradas y salidas de atletas universitarios al gimnasio D.U.B.S.
          </p>
        </div>

        <button
          onClick={() => setIsScannerOpen(true)}
          style={{
            padding: '0.55rem 1rem',
            borderRadius: '4px',
            border: '1px solid #005FA8',
            background: '#0077D4',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.80rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            textTransform: 'uppercase',
            letterSpacing: '0.03em'
          }}
        >
          <FaExpand /> Escáner / Validador QR
        </button>
      </div>

      {/* PANEL REGISTRO RÁPIDO */}
      <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '4px', border: '1px solid #CBD5E1', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          <FaUserCheck style={{ color: '#0077D4' }} /> Registrar Marcación Directa
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.85rem', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Seleccionar Atleta / Código R.U. *
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value ? Number(e.target.value) : '')}
              style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem', backgroundColor: '#FFF' }}
            >
              <option value="">-- Buscar por Nombre o C.I. --</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre} {u.apellido} (C.I: {u.ci || 'N/A'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleMarcacion('entrada')}
            disabled={!selectedUser || createMutation.isPending}
            style={{
              padding: '0.55rem 1rem', borderRadius: '4px', border: '1px solid #166534',
              background: '#15803D',
              color: '#FFFFFF', fontWeight: 700, fontSize: '0.80rem', cursor: selectedUser ? 'pointer' : 'not-allowed',
              opacity: selectedUser ? 1 : 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              textTransform: 'uppercase', letterSpacing: '0.03em'
            }}
          >
            <FaRightToBracket /> Registrar Entrada
          </button>

          <button
            onClick={() => handleMarcacion('salida')}
            disabled={!selectedUser || createMutation.isPending}
            style={{
              padding: '0.55rem 1rem', borderRadius: '4px', border: '1px solid #B91C1C',
              background: '#DC2626',
              color: '#FFFFFF', fontWeight: 700, fontSize: '0.80rem', cursor: selectedUser ? 'pointer' : 'not-allowed',
              opacity: selectedUser ? 1 : 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              textTransform: 'uppercase', letterSpacing: '0.03em'
            }}
          >
            <FaRightFromBracket /> Registrar Salida
          </button>
        </div>
      </div>

      {/* FILTRO Y HISTORIAL DE MARCACIONES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaClock style={{ color: '#0077D4' }} /> Historial de Asistencia en Tiempo Real ({filteredRegistros.length})
        </h3>
        <input
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filtrar por nombre o C.I..."
          style={{ padding: '0.45rem 0.75rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.82rem', width: '240px' }}
        />
      </div>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>Cargando marcaciones de acceso...</div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #CBD5E1', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <tr>
                <th style={{ padding: '0.65rem 0.85rem' }}>Fecha & Hora Marcación</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Atleta / Usuario</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Documento C.I.</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Tipo Movimiento</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistros.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#0F172A', fontFamily: 'monospace' }}>
                    {new Date(r.fecha_hora).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0077D4' }}>
                    {r.usuario?.nombre} {r.usuario?.apellido}
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', color: '#64748B' }}>{r.usuario?.ci || 'N/A'}</td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <span style={{
                      padding: '0.15rem 0.5rem', borderRadius: '2px', fontSize: '0.70rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.03em',
                      background: r.tipo === 'entrada' ? '#DCFCE7' : '#FEE2E2',
                      color: r.tipo === 'entrada' ? '#166534' : '#991B1B',
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    }}>
                      {r.tipo === 'entrada' ? <FaRightToBracket size={11} /> : <FaRightFromBracket size={11} />}
                      {r.tipo.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EscanerQRModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </section>
  );
};

export default RegistroAccesosPage;
