// src/features/tramites/pages/TramitesPage.tsx
import React, { useState } from 'react';
import { FaFileInvoiceDollar, FaPlus, FaReceipt, FaCheckDouble, FaFilePen, FaFilePdf, FaCheck, FaXmark, FaFolderOpen, FaEye, FaFileLines, FaPaperclip, FaCreditCard, FaPrint, FaQrcode, FaFilter, FaMagnifyingGlass, FaRotateLeft, FaCalendarDays, FaClock, FaLock, FaUser, FaCircleCheck } from 'react-icons/fa6';
import {
  useFormulariosSolicitud, useBoletasPago, useBoletasInscripcion,
  useCreateFormularioSolicitud, useUpdateEstadoSolicitud, useCreateBoletaPago, useCreateBoletaInscripcion,
  useEmitirInscripcionDesdePago
} from '../hooks/useTramites';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import FormularioDUBSSModal from '@/features/historial/components/FormularioDUBSSModal';
import FormularioDUBSSCreateModal from '../components/FormularioDUBSSCreateModal';
import BoletaPagoModal from '../components/BoletaPagoModal';
import BoletaInscripcionModal from '../components/BoletaInscripcionModal';
import CodigoQRInscripcionModal from '../components/CodigoQRInscripcionModal';
import { FaTelegram } from 'react-icons/fa6';
import { useTelegramEstado } from '@/features/telegram/hooks/useTelegram';
import VincularTelegramModal from '@/features/telegram/components/VincularTelegramModal';
import { resolveDocumentFileUrl } from '@/features/documentos/services/documentoService';

import showToast from '@/utils/toast';

const TramitesPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol === 'administrador' || user?.rol === 'recepcionista';
  const isCliente = user?.rol === 'cliente';

  const [tab, setTab] = useState<'solicitudes' | 'pagos' | 'inscripciones'>('solicitudes');
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const { data: telegramEstado } = useTelegramEstado(isCliente);

  const { data: rawSolData, isLoading: loadSol } = useFormulariosSolicitud();
  const { data: rawPagosData, isLoading: loadPagos } = useBoletasPago();
  const { data: rawInscData, isLoading: loadInsc } = useBoletasInscripcion();

  const solicitudes = Array.isArray(rawSolData) ? rawSolData : Array.isArray((rawSolData as any)?.data) ? (rawSolData as any).data : [];
  const pagos = Array.isArray(rawPagosData) ? rawPagosData : Array.isArray((rawPagosData as any)?.data) ? (rawPagosData as any).data : [];
  const inscripciones = Array.isArray(rawInscData) ? rawInscData : Array.isArray((rawInscData as any)?.data) ? (rawInscData as any).data : [];

  // Filter States
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const checkDateRange = (dateStr?: string) => {
    if (!dateStr) return true;
    const itemDate = String(dateStr).split('T')[0];
    if (!itemDate) return true;
    if (fechaDesde && itemDate < fechaDesde) return false;
    if (fechaHasta && itemDate > fechaHasta) return false;
    return true;
  };

  const filteredSolicitudes = solicitudes.filter((s: any) => {
    if (!isAdmin) {
      const isOwner = Number(s.id_usuario) === Number(user?.id) || Number(s.usuario?.id) === Number(user?.id);
      if (!isOwner) return false;
    }
    const est = String(s.estado || 'pendiente').toLowerCase();
    if (filtroEstado !== 'todos' && est !== filtroEstado) return false;

    const fechaItem = s.created_at || s.fecha_solicitud || s.fecha_registro || s.fecha;
    if (!checkDateRange(fechaItem)) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const num = String(s.numero_formulario || '').toLowerCase();
      const nombre = `${s.usuario?.nombre || ''} ${s.usuario?.apellido || ''}`.toLowerCase();
      const email = String(s.usuario?.email || '').toLowerCase();
      const disc = String(s.disciplina?.nombre || '').toLowerCase();
      if (!num.includes(q) && !nombre.includes(q) && !email.includes(q) && !disc.includes(q)) return false;
    }
    return true;
  });

  const filteredPagos = pagos.filter((p: any) => {
    if (!isAdmin) {
      const isOwner = Number(p.formulario_solicitud?.id_usuario) === Number(user?.id) || Number(p.formulario_solicitud?.usuario?.id) === Number(user?.id);
      if (!isOwner) return false;
    }
    const est = String(p.estado || 'pendiente').toLowerCase();
    if (filtroEstado !== 'todos' && est !== filtroEstado) return false;

    const fechaItem = p.created_at || p.fecha_pago || p.fecha_emision || p.fecha;
    if (!checkDateRange(fechaItem)) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const num = String(p.numero_boleta || '').toLowerCase();
      const u = p.formulario_solicitud?.usuario;
      const nombre = `${u?.nombre || ''} ${u?.apellido || ''}`.toLowerCase();
      const numForm = String(p.formulario_solicitud?.numero_formulario || '').toLowerCase();
      if (!num.includes(q) && !nombre.includes(q) && !numForm.includes(q)) return false;
    }
    return true;
  });

  const filteredInscripciones = inscripciones.filter((ins: any) => {
    if (!isAdmin) {
      const isOwner = Number(ins.id_usuario) === Number(user?.id) || Number(ins.usuario?.id) === Number(user?.id);
      if (!isOwner) return false;
    }
    const est = String(ins.estado || 'activo').toLowerCase();
    if (filtroEstado !== 'todos' && est !== filtroEstado) return false;

    const fechaItem = ins.created_at || ins.fecha_inscripcion || ins.fecha_inicio || ins.fecha;
    if (!checkDateRange(fechaItem)) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const num = String(ins.numero_boleta || '').toLowerCase();
      const u = ins.usuario;
      const nombre = (u?.name || `${u?.nombre || ''} ${u?.apellido || ''}`).toLowerCase();
      const email = String(u?.email || '').toLowerCase();
      if (!num.includes(q) && !nombre.includes(q) && !email.includes(q)) return false;
    }
    return true;
  });

  const createSolMutation = useCreateFormularioSolicitud();
  const updateEstadoMutation = useUpdateEstadoSolicitud();
  const createPagoMutation = useCreateBoletaPago();
  const createInscMutation = useCreateBoletaInscripcion();
  const emitirInscripcionMutation = useEmitirInscripcionDesdePago();

  const [isCreateDubssModalOpen, setIsCreateDubssModalOpen] = useState(false);
  const [isSolModal, setIsSolModal] = useState(false);
  const [isPagoModal, setIsPagoModal] = useState(false);
  const [isInscModal, setIsInscModal] = useState(false);
  const [isDubssModalOpen, setIsDubssModalOpen] = useState(false);
  const [selectedUserForDubss, setSelectedUserForDubss] = useState<any>(null);

  const [selectedSolForDocs, setSelectedSolForDocs] = useState<any>(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // States for Emitir Inscripcion desde Pago modal
  const [selectedPagoForEmitir, setSelectedPagoForEmitir] = useState<any>(null);
  const [isEmitirModalOpen, setIsEmitirModalOpen] = useState(false);
  const [numComprobanteCampus, setNumComprobanteCampus] = useState('');
  const [fechaInicioMembresia, setFechaInicioMembresia] = useState(() => new Date().toISOString().split('T')[0]);
  const [fechaFinMembresia, setFechaFinMembresia] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  // State for Boleta de Pago Print modal
  const [selectedPagoForPrint, setSelectedPagoForPrint] = useState<any>(null);
  const [isPagoPrintModalOpen, setIsPagoPrintModalOpen] = useState(false);

  // State for Boleta de Inscripción View modal
  const [selectedInscripcionForView, setSelectedInscripcionForView] = useState<any>(null);
  const [isInscripcionViewModalOpen, setIsInscripcionViewModalOpen] = useState(false);

  // State for Codigo QR Modal
  const [selectedInscripcionForQR, setSelectedInscripcionForQR] = useState<any>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; apellido: string }[]>([]);
  const [disciplinas, setDisciplinas] = useState<{ id: number; nombre: string }[]>([]);

  // Form Solicitud states
  const [numSol, setNumSol] = useState('');
  const [idDiscSol, setIdDiscSol] = useState<number | ''>('');
  const [idUserSol, setIdUserSol] = useState<number | ''>('');

  // Form Pago states
  const [numPago, setNumPago] = useState('');
  const [montoPago, setMontoPago] = useState(150);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [idFormPago, setIdFormPago] = useState<number | ''>('');

  // Form Inscripcion states
  const [numInsc, setNumInsc] = useState('');
  const [montoInsc, setMontoInsc] = useState(150);
  const [idUserInsc, setIdUserInsc] = useState<number | ''>('');

  React.useEffect(() => {
    api.get('/usuarios').then((r) => setUsuarios(Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/disciplinas').then((r) => setDisciplinas(Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])).catch(() => {});
  }, []);

  const handleCreateSolicitud = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numSol || !idDiscSol || !idUserSol) return;
    createSolMutation.mutate({
      numero_formulario: numSol,
      id_disciplina: Number(idDiscSol),
      id_usuario: Number(idUserSol),
      estado: 'pendiente',
    }, {
      onSuccess: () => { setIsSolModal(false); setNumSol(''); }
    });
  };

  const handleCreatePago = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numPago || !idFormPago) return;
    createPagoMutation.mutate({
      numero_boleta: numPago,
      monto: Number(montoPago),
      metodo_pago: metodoPago,
      id_formulario: Number(idFormPago),
      estado: 'completado',
    }, {
      onSuccess: () => { setIsPagoModal(false); setNumPago(''); }
    });
  };

  const handleCreateInscripcion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numInsc || !idUserInsc) return;
    createInscMutation.mutate({
      numero_boleta: numInsc,
      monto: Number(montoInsc),
      id_usuario: Number(idUserInsc),
      estado: 'activo',
    }, {
      onSuccess: () => { setIsInscModal(false); setNumInsc(''); }
    });
  };

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaFileInvoiceDollar style={{ color: 'var(--color-primary-text)' }} /> Trámites, Pagos & Boletas de Inscripción
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Gestión de solicitudes de ingreso, comprobantes de pago y boletas oficiales de membresía universitaria.
          </p>
        </div>
      </div>

      {/* BANNER TELEGRAM PARA CLIENTES */}
      {isCliente && (
        <div style={{
          backgroundColor: telegramEstado?.vinculado ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 158, 217, 0.08)',
          border: telegramEstado?.vinculado ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(34, 158, 217, 0.35)',
          borderRadius: '4px',
          padding: '0.85rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              width: '34px', height: '34px', borderRadius: '4px',
              backgroundColor: telegramEstado?.vinculado ? '#22C55E' : '#229ED9',
              color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0,
            }}>
              <FaTelegram />
            </span>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-primary, #F4F4F5)' }}>
                {telegramEstado?.vinculado ? 'Alertas de Membresía activas en Telegram' : 'Recibe avisos de vencimiento de tu membresía en Telegram'}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted, #A1A1AA)' }}>
                {telegramEstado?.vinculado
                  ? `Cuenta vinculada. Te notificaremos automáticamente antes de que caduque tu boleta de inscripción.`
                  : 'Conecta tu cuenta con nuestro bot oficial para recibir recordatorios automáticos en tu celular.'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTelegramModalOpen(true)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '4px',
              border: telegramEstado?.vinculado ? '1px solid rgba(34, 197, 94, 0.4)' : 'none',
              backgroundColor: telegramEstado?.vinculado ? 'rgba(34, 197, 94, 0.12)' : '#229ED9',
              color: telegramEstado?.vinculado ? '#4ADE80' : '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
          >
            <FaTelegram />
            {telegramEstado?.vinculado ? 'Gestionar Telegram' : 'Vincular mi Telegram'}
          </button>
        </div>
      )}

      {/* TABS NAVEGACIÓN */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
        <button
          onClick={() => { setTab('solicitudes'); setFiltroEstado('todos'); }}
          style={{
            padding: '0.65rem 1.25rem', border: 'none', background: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
            borderBottom: tab === 'solicitudes' ? '2px solid var(--color-primary)' : '2px solid transparent', color: tab === 'solicitudes' ? 'var(--color-primary-text)' : 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.15s ease',
          }}
        >
          <FaFilePen /> Formularios de Solicitud ({solicitudes.length})
        </button>
        <button
          onClick={() => { setTab('pagos'); setFiltroEstado('todos'); }}
          style={{
            padding: '0.65rem 1.25rem', border: 'none', background: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
            borderBottom: tab === 'pagos' ? '2px solid var(--color-primary)' : '2px solid transparent', color: tab === 'pagos' ? 'var(--color-primary-text)' : 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.15s ease',
          }}
        >
          <FaReceipt /> Boletas de Pago ({pagos.length})
        </button>
        <button
          onClick={() => { setTab('inscripciones'); setFiltroEstado('todos'); }}
          style={{
            padding: '0.65rem 1.25rem', border: 'none', background: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
            borderBottom: tab === 'inscripciones' ? '2px solid var(--color-primary)' : '2px solid transparent', color: tab === 'inscripciones' ? 'var(--color-primary-text)' : 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.15s ease',
          }}
        >
          <FaCheckDouble /> Boletas de Inscripción ({inscripciones.length})
        </button>
      </div>

      {/* BARRA DE FILTROS DINÁMICOS */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: '0.85rem 1rem',
        borderRadius: '4px',
        border: '1px solid var(--color-border)',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
          {/* BUSCADOR POR TEXTO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '220px', flex: '1 1 220px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FaMagnifyingGlass style={{ color: 'var(--color-primary-text)' }} /> Buscar por N°, Socio o Email
            </label>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '4px',
                border: '1px solid var(--color-border-strong)',
                fontSize: '0.82rem',
                outline: 'none',
                width: '100%',
                backgroundColor: 'var(--color-surface-muted)'
              }}
            />
          </div>

          {/* FILTRO DE ESTADO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '190px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FaFilter style={{ color: 'var(--color-primary-text)' }} /> Estado del Formulario
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '4px',
                border: '1px solid var(--color-border-strong)',
                fontSize: '0.82rem',
                outline: 'none',
                backgroundColor: 'var(--color-surface-muted)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="todos">Todos los Estados</option>
              {tab === 'solicitudes' && (
                <>
                  <option value="pendiente">Pendiente (Cupo Reservado)</option>
                  <option value="aprobado">Aprobado (Cupo Ocupado)</option>
                  <option value="rechazado">Rechazado (Cupo Liberado)</option>
                </>
              )}
              {tab === 'pagos' && (
                <>
                  <option value="pendiente">Pendiente (Caja Campus)</option>
                  <option value="completado">Completado</option>
                </>
              )}
              {tab === 'inscripciones' && (
                <>
                  <option value="activo">Activo</option>
                  <option value="vencido">Vencido / Inactivo</option>
                </>
              )}
            </select>
          </div>

          {/* FECHA DESDE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FaCalendarDays style={{ color: 'var(--color-primary-text)' }} /> Fecha Desde
            </label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '4px',
                border: '1px solid var(--color-border-strong)',
                fontSize: '0.82rem',
                outline: 'none',
                backgroundColor: 'var(--color-surface-muted)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>

          {/* FECHA HASTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FaCalendarDays style={{ color: 'var(--color-primary-text)' }} /> Fecha Hasta
            </label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '4px',
                border: '1px solid var(--color-border-strong)',
                fontSize: '0.82rem',
                outline: 'none',
                backgroundColor: 'var(--color-surface-muted)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>
        </div>

        {/* BOTÓN LIMPIAR FILTROS */}
        {(filtroEstado !== 'todos' || fechaDesde || fechaHasta || searchTerm) && (
          <button
            onClick={() => {
              setFiltroEstado('todos');
              setFechaDesde('');
              setFechaHasta('');
              setSearchTerm('');
            }}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--color-border-strong)',
              backgroundColor: 'var(--color-surface-muted)',
              color: 'var(--color-text-secondary)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <FaRotateLeft /> Limpiar Filtros
          </button>
        )}
      </div>

      {/* TAB 1: SOLICITUDES */}
      {tab === 'solicitudes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1rem' }}>
            <button
              onClick={() => {
                setSelectedUserForDubss(user);
                setIsDubssModalOpen(true);
              }}
              style={{
                padding: '0.55rem 1rem', background: '#D97706', color: '#FFF', border: '1px solid #B45309', borderRadius: '4px',
                fontWeight: 700, fontSize: '0.80rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                textTransform: 'uppercase', letterSpacing: '0.03em'
              }}
            >
              <FaFilePdf /> Imprimir Modelo DUBSS-FR-03
            </button>
            {isCliente && (
              <button
                onClick={() => setIsCreateDubssModalOpen(true)}
                style={{
                  padding: '0.55rem 1rem', background: 'var(--color-primary)',
                  color: '#FFF', border: '1px solid var(--color-primary)', borderRadius: '4px', fontWeight: 700, fontSize: '0.80rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                  textTransform: 'uppercase', letterSpacing: '0.03em'
                }}
              >
                <FaPlus /> Crear Solicitud (DUBSS-FR-03)
              </button>
            )}
          </div>
          {loadSol ? <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Cargando solicitudes...</div> : filteredSolicitudes.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              {solicitudes.length === 0
                ? 'No hay formularios de solicitud registrados al momento.'
                : 'No se encontraron solicitudes que coincidan con los filtros aplicados.'}
            </div>
          ) : (
            <div style={{ background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead style={{ background: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border-strong)' }}>
                  <tr>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Nº Formulario</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Usuario / Socio</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Disciplina & Horario</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Estado / Reserva</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSolicitudes.map((s: any) => {
                    const estadoStr = String(s.estado || 'pendiente').toLowerCase();
                    const isPendiente = estadoStr === 'pendiente';
                    const isAprobado = estadoStr === 'aprobado';
                    const isRechazado = estadoStr === 'rechazado';

                    const boletasList = Array.isArray(s.boletas_pago) ? s.boletas_pago : Array.isArray(s.boletasPago) ? s.boletasPago : [];
                    const hasPagoCompletado = boletasList.some((b: any) => String(b.estado || '').toLowerCase() === 'completado');

                    const badgeStyle = isAprobado
                      ? { bg: 'var(--color-success-bg)', color: 'var(--color-success-text)', text: 'APROBADO (Cupo Ocupado)' }
                      : isRechazado
                      ? { bg: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', text: 'RECHAZADO (Cupo Liberado)' }
                      : { bg: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', text: 'PENDIENTE (Cupo Reservado)' };

                    const dh = s.disciplina_horario || s.disciplinaHorario;
                    const h = dh?.horario;
                    const formatTime = (t?: string) => t ? String(t).slice(0, 5) : '';
                    const horarioStr = h ? `${h.dia_semana ? h.dia_semana + ': ' : ''}${formatTime(h.hora_inicio || h.inicio)} - ${formatTime(h.hora_fin || h.fin)}` : '';

                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>{s.numero_formulario}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontWeight: 600 }}>{s.usuario?.nombre} {s.usuario?.apellido}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{s.usuario?.email}</div>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-primary-text)' }}>{s.disciplina?.nombre}</div>
                          {horarioStr && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><FaClock size={11} /> {horarioStr}</div>}
                          {s.plan && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-success-text)', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaCreditCard size={11} /> {s.plan.nombre} {s.plan.tarifa?.precio ? `(Bs. ${Number(s.plan.tarifa.precio).toFixed(2)})` : ''}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <span style={{ padding: '0.2rem 0.5rem', borderRadius: '2px', background: badgeStyle.bg, color: badgeStyle.color, fontWeight: 700, fontSize: '0.70rem', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'inline-block' }}>
                            {badgeStyle.text}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            {isAdmin && (
                              <>
                                {hasPagoCompletado ? (
                                  <span
                                    title="La Boleta de Inscripción ya fue emitida. El estado de la solicitud no puede modificarse."
                                    style={{
                                      padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)',
                                      border: '1px solid var(--color-border-strong)', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                                    }}
                                  >
                                    <FaLock size={11} /> Inscrito / Pago Verificado
                                  </span>
                                ) : (
                                  <>
                                    {!isAprobado && (
                                      <button
                                        onClick={() => updateEstadoMutation.mutate({ id: s.id, estado: 'aprobado' })}
                                        title="Aprobar Solicitud de Membresía"
                                        style={{
                                          padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)',
                                          border: '1px solid rgba(22, 163, 74, 0.35)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                                        }}
                                      >
                                        <FaCheck size={11} /> Aprobar
                                      </button>
                                    )}
                                    {!isRechazado && (
                                      <button
                                        onClick={() => updateEstadoMutation.mutate({ id: s.id, estado: 'rechazado' })}
                                        title="Rechazar Solicitud (Libera Cupo)"
                                        style={{
                                          padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)',
                                          border: '1px solid rgba(220, 38, 38, 0.35)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                                        }}
                                      >
                                        <FaXmark size={11} /> Rechazar
                                      </button>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                            <button
                              onClick={() => {
                                setSelectedSolForDocs(s);
                                setIsDocsModalOpen(true);
                              }}
                              title="Ver Documentos Digitales Adjuntados por el Usuario"
                              style={{
                                padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary-text)',
                                border: '1px solid rgba(220, 38, 38, 0.30)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                              }}
                            >
                              <FaFolderOpen size={11} /> Documentos ({s.usuario?.documentos?.length || 0})
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUserForDubss(s.usuario || user);
                                setIsDubssModalOpen(true);
                              }}
                              title="Ver Formulario Oficial DUBSS-FR-03"
                              style={{
                                padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning-text)',
                                border: '1px solid rgba(217, 119, 6, 0.35)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                              }}
                            >
                              <FaFilePdf size={11} /> PDF DUBSS-FR-03
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAGOS */}
      {tab === 'pagos' && (
        <div>
          {isAdmin && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button onClick={() => setIsPagoModal(true)} style={{ padding: '0.55rem 1rem', background: 'var(--color-primary)', color: '#FFF', border: '1px solid var(--color-primary)', borderRadius: '4px', fontWeight: 700, fontSize: '0.80rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                <FaPlus /> Registrar Boleta de Pago Manual
              </button>
            </div>
          )}
          {loadPagos ? <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Cargando pagos...</div> : filteredPagos.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              {pagos.length === 0
                ? 'No hay boletas de pago registradas al momento.'
                : 'No se encontraron boletas de pago que coincidan con los filtros aplicados.'}
            </div>
          ) : (
            <div style={{ background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead style={{ background: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border-strong)' }}>
                  <tr>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Nº Boleta</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Formulario / Socio</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Monto (Bs.)</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Método / Origen</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Estado de Pago</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPagos.map((p: any, idx: number) => {
                    const estadoPago = String(p?.estado || 'pendiente').toLowerCase();
                    const isPendientePago = estadoPago === 'pendiente';
                    const isCompletadoPago = estadoPago === 'completado';
                    const u = p?.formulario_solicitud?.usuario;

                    const badgeStyle = isCompletadoPago
                      ? { bg: 'var(--color-success-bg)', color: 'var(--color-success-text)', text: 'COMPLETADO' }
                      : { bg: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', text: 'PENDIENTE (Pagar en Caja Campus)' };

                    return (
                      <tr key={p?.id || idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>{p?.numero_boleta}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontWeight: 600 }}>{u ? `${u.nombre} ${u.apellido}` : '-'}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{p?.formulario_solicitud?.numero_formulario}</div>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: 'var(--color-primary-text)' }}>Bs. {p?.monto || 0}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{p?.metodo_pago || 'Caja Campus UAGRM'}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <span style={{ padding: '0.2rem 0.5rem', borderRadius: '2px', background: badgeStyle.bg, color: badgeStyle.color, fontWeight: 700, fontSize: '0.70rem', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'inline-block' }}>
                            {badgeStyle.text}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => {
                                setSelectedPagoForPrint(p);
                                setIsPagoPrintModalOpen(true);
                              }}
                              title="Ver e Imprimir Boleta de Pago / Orden de Depósito en Caja Campus"
                              style={{
                                padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning-text)',
                                border: '1px solid rgba(217, 119, 6, 0.35)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                              }}
                            >
                              <FaPrint size={11} /> Imprimir Boleta
                            </button>
                            {isAdmin && isPendientePago && (
                              <button
                                onClick={() => {
                                  setSelectedPagoForEmitir(p);
                                  setNumComprobanteCampus(p?.comprobante_url || '');
                                  setIsEmitirModalOpen(true);
                                }}
                                title="Validar Comprobante de Caja Campus y Emitir Boleta de Inscripción"
                                style={{
                                  padding: '0.3rem 0.65rem', borderRadius: '4px', backgroundColor: 'var(--color-primary)', color: '#FFF',
                                  border: '1px solid var(--color-primary)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
                                }}
                              >
                                <FaCreditCard size={11} style={{ color: '#FCD34D' }} /> Validar Pago & Emitir
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INSCRIPCIONES */}
      {tab === 'inscripciones' && (
        <div>
          {isAdmin && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button onClick={() => setIsInscModal(true)} style={{ padding: '0.55rem 1rem', background: 'var(--color-primary)', color: '#FFF', border: '1px solid var(--color-primary)', borderRadius: '4px', fontWeight: 700, fontSize: '0.80rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                <FaPlus /> Emitir Boleta de Inscripción
              </button>
            </div>
          )}
          {loadInsc ? <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Cargando inscripciones...</div> : filteredInscripciones.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              {inscripciones.length === 0
                ? 'No hay boletas de inscripción registradas al momento.'
                : 'No se encontraron boletas de inscripción que coincidan con los filtros aplicados.'}
            </div>
          ) : (
            <div style={{ background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead style={{ background: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border-strong)' }}>
                  <tr>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Nº Boleta</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Usuario Inscrito</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Monto Pagado</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Vigencia</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Estado</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInscripciones.map((ins: any, idx: number) => (
                    <tr key={ins?.id || idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>{ins?.numero_boleta}</td>
                      <td style={{ padding: '0.65rem 0.85rem' }}>{ins?.usuario?.name || [ins?.usuario?.nombre, ins?.usuario?.apellido].filter(Boolean).join(' ') || ins?.usuario?.email || '-'}</td>
                      <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--color-primary-text)' }}>Bs. {ins?.monto || 0}</td>
                      <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-muted)' }}>{ins?.fecha_inicio || 'Hoy'} - {ins?.fecha_fin || '30 días'}</td>
                      <td style={{ padding: '0.65rem 0.85rem' }}><span style={{ padding: '0.2rem 0.5rem', borderRadius: '2px', background: 'var(--color-success-bg)', color: 'var(--color-success-text)', fontWeight: 700, fontSize: '0.70rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{ins?.estado || 'activo'}</span></td>
                      <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => {
                              setSelectedInscripcionForQR(ins);
                              setIsQRModalOpen(true);
                            }}
                            title="Ver e Imprimir Pase Digital de Ingreso QR"
                            style={{
                              padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: '#EDE9FE', color: '#6D28D9',
                              border: '1px solid #DDD6FE', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                            }}
                          >
                            <FaQrcode size={11} /> Pase QR
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInscripcionForView(ins);
                              setIsInscripcionViewModalOpen(true);
                            }}
                            title="Ver y Emitir Boleta Oficial de Inscripción"
                            style={{
                              padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)',
                              border: '1px solid rgba(22, 163, 74, 0.35)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                            }}
                          >
                            <FaEye size={11} /> Ver Boleta
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL SOLICITUD */}
      {isSolModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0, 0, 0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Nueva Solicitud</h3>
            <form onSubmit={handleCreateSolicitud} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input value={numSol} onChange={(e) => setNumSol(e.target.value)} placeholder="Nº Formulario (Ej: SOL-2026-001)" style={{ padding: '0.5rem', border: '1px solid var(--color-border-strong)', borderRadius: '6px' }} />
              <select value={idUserSol} onChange={(e) => setIdUserSol(e.target.value ? Number(e.target.value) : '')} style={{ padding: '0.5rem', border: '1px solid var(--color-border-strong)', borderRadius: '6px', backgroundColor: 'var(--color-surface)' }}>
                <option value="">-- Usuario --</option>{(Array.isArray(usuarios) ? usuarios : []).map((u: any) => <option key={u?.id} value={u?.id}>{u?.nombre || u?.name} {u?.apellido}</option>)}
              </select>
              <select value={idDiscSol} onChange={(e) => setIdDiscSol(e.target.value ? Number(e.target.value) : '')} style={{ padding: '0.5rem', border: '1px solid var(--color-border-strong)', borderRadius: '6px', backgroundColor: 'var(--color-surface)' }}>
                <option value="">-- Disciplina --</option>{(Array.isArray(disciplinas) ? disciplinas : []).map((d) => <option key={d?.id} value={d?.id}>{d?.nombre}</option>)}
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsSolModal(false)} style={{ padding: '0.5rem 1rem' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: '#FFF', border: 'none', borderRadius: '6px' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PAGO */}
      {isPagoModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0, 0, 0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Registrar Pago</h3>
            <form onSubmit={handleCreatePago} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input value={numPago} onChange={(e) => setNumPago(e.target.value)} placeholder="Nº Boleta Pago (Ej: PAG-00921)" style={{ padding: '0.5rem', border: '1px solid var(--color-border-strong)', borderRadius: '6px' }} />
              <input type="number" value={montoPago} onChange={(e) => setMontoPago(Number(e.target.value))} placeholder="Monto (Bs.)" style={{ padding: '0.5rem', border: '1px solid var(--color-border-strong)', borderRadius: '6px' }} />
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} style={{ padding: '0.5rem', border: '1px solid var(--color-border-strong)', borderRadius: '6px', backgroundColor: 'var(--color-surface)' }}>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia QR">Transferencia QR</option>
                <option value="Tarjeta de Débito">Tarjeta de Débito</option>
              </select>
              <select value={idFormPago} onChange={(e) => setIdFormPago(e.target.value ? Number(e.target.value) : '')} style={{ padding: '0.5rem', border: '1px solid var(--color-border-strong)', borderRadius: '6px', backgroundColor: 'var(--color-surface)' }}>
                <option value="">-- Referencia Formulario Solicitud --</option>{(Array.isArray(solicitudes) ? solicitudes : []).map((s) => <option key={s.id} value={s.id}>{s.numero_formulario} ({s.usuario?.nombre})</option>)}
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsPagoModal(false)} style={{ padding: '0.5rem 1rem' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: '#FFF', border: 'none', borderRadius: '6px' }}>Guardar Pago</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INSCRIPCION */}
      {isInscModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0, 0, 0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Emitir Inscripción</h3>
            <form onSubmit={handleCreateInscripcion} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input value={numInsc} onChange={(e) => setNumInsc(e.target.value)} placeholder="Nº Boleta Inscripción (Ej: INS-2026-88)" style={{ padding: '0.5rem', border: '1px solid var(--color-border-strong)', borderRadius: '6px' }} />
              <input type="number" value={montoInsc} onChange={(e) => setMontoInsc(Number(e.target.value))} placeholder="Monto (Bs.)" style={{ padding: '0.5rem', border: '1px solid var(--color-border-strong)', borderRadius: '6px' }} />
              <select value={idUserInsc} onChange={(e) => setIdUserInsc(e.target.value ? Number(e.target.value) : '')} style={{ padding: '0.5rem', border: '1px solid var(--color-border-strong)', borderRadius: '6px', backgroundColor: 'var(--color-surface)' }}>
                <option value="">-- Usuario --</option>{(Array.isArray(usuarios) ? usuarios : []).map((u) => <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>)}
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsInscModal(false)} style={{ padding: '0.5rem 1rem' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: '#FFF', border: 'none', borderRadius: '6px' }}>Emitir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORMULARIO INTERACTIVO DUBSS-FR-03 PARA CREAR SOLICITUD */}
      <FormularioDUBSSCreateModal
        isOpen={isCreateDubssModalOpen}
        onClose={() => setIsCreateDubssModalOpen(false)}
        onSubmit={(payload) => {
          createSolMutation.mutate(payload, {
            onSuccess: () => setIsCreateDubssModalOpen(false),
            onError: (err: any) => {
              const msg = err.response?.data?.errors?.id_disciplina?.[0]
                || err.response?.data?.errors?.horario?.[0]
                || err.response?.data?.message
                || 'Error al registrar la solicitud.';
              showToast.warning(msg, 'Restricción de Solicitud');
            }
          });
        }}
        isPending={createSolMutation.isPending}
      />

      {/* MODAL VISTA PREVIA IMPRESIÓN FORMULARIO DUBSS-FR-03 */}
      <FormularioDUBSSModal
        isOpen={isDubssModalOpen}
        historial={null}
        usuario={selectedUserForDubss}
        onClose={() => setIsDubssModalOpen(false)}
      />

      {/* MODAL VER DOCUMENTOS DIGITALES DEL USUARIO */}
      {isDocsModalOpen && selectedSolForDocs && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0, 0, 0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--color-surface)', borderRadius: '12px', width: '100%', maxWidth: '650px',
            maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', border: '1px solid var(--color-border-strong)'
          }}>
            {/* HEADER */}
            <div style={{
              padding: '1.25rem 1.5rem', backgroundColor: 'var(--color-primary)', color: '#FFF',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FaFolderOpen style={{ fontSize: '1.25rem', color: '#F59E0B' }} />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                    Documentos Digitales del Postulante
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#FCA5A5' }}>
                    Solicitud Nº: {selectedSolForDocs.numero_formulario}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsDocsModalOpen(false)}
                style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: '#FFF', border: 'none', cursor: 'pointer' }}
              >
                <FaXmark style={{ fontSize: '1.1rem' }} />
              </button>
            </div>

            {/* USER INFO BAR */}
            <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)', fontSize: '0.88rem' }}>
              <div style={{ fontWeight: 800, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaUser /> {selectedSolForDocs.usuario?.nombre} {selectedSolForDocs.usuario?.apellido}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                <span><strong>C.I.:</strong> {selectedSolForDocs.usuario?.ci || '-'}</span>
                <span><strong>Email:</strong> {selectedSolForDocs.usuario?.email || '-'}</span>
                <span><strong>Código/RU:</strong> {selectedSolForDocs.usuario?.codigo || '-'}</span>
              </div>
            </div>

            {/* CONTENT */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {Array.isArray(selectedSolForDocs.usuario?.documentos) && selectedSolForDocs.usuario.documentos.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {selectedSolForDocs.usuario.documentos.map((doc: any) => {
                    const nombreTipo = doc.tipo_documento?.nombre || doc.tipoDocumento?.nombre || 'Documento';
                    const fileUrl = doc.archivo_url || doc.ruta_archivo;
                    return (
                      <div key={doc.id} style={{
                        padding: '0.85rem 1rem', borderRadius: '8px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-strong)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <FaFileLines style={{ color: 'var(--color-primary-text)', fontSize: '1.4rem', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{nombreTipo}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-success-text)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <FaCircleCheck size={12} /> Documento Oficial Cargado
                            </span>
                          </div>
                        </div>
                        {fileUrl && (
                          <a
                            href={resolveDocumentFileUrl(doc)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '0.4rem 0.8rem', borderRadius: '6px', backgroundColor: 'var(--color-primary)', color: '#FFF',
                              fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                            }}
                          >
                            <FaEye /> Abrir / Ver Documento
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--color-warning-bg)', borderRadius: '8px', border: '1px solid rgba(217, 119, 6, 0.35)', color: 'var(--color-warning-text)' }}>
                  <FaPaperclip style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Sin archivos digitales adjuntos</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    Este socio no ha subido archivos a la plataforma digital aún. Podrá solicitar fotocopias físicas de C.I. y Matrícula al verificar la inscripción.
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'var(--color-surface-muted)' }}>
              <button
                onClick={() => setIsDocsModalOpen(false)}
                style={{ padding: '0.55rem 1.25rem', borderRadius: '6px', backgroundColor: '#64748B', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EMITIR INSCRIPCION DESDE PAGO CAJA CAMPUS */}
      {isEmitirModalOpen && selectedPagoForEmitir && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0, 0, 0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: '12px', width: '100%', maxWidth: '460px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'var(--color-primary)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FaCreditCard style={{ color: '#F59E0B', fontSize: '1.2rem' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Validar Pago & Emitir Inscripción</h3>
              </div>
              <button onClick={() => setIsEmitirModalOpen(false)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><FaXmark /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!selectedPagoForEmitir) return;
              emitirInscripcionMutation.mutate({
                id: selectedPagoForEmitir.id,
                numero_comprobante: numComprobanteCampus,
                fecha_inicio: fechaInicioMembresia,
                fecha_fin: fechaFinMembresia,
              }, {
                onSuccess: () => {
                  setIsEmitirModalOpen(false);
                  setNumComprobanteCampus('');
                  setSelectedPagoForEmitir(null);
                }
              });
            }} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Socio: {selectedPagoForEmitir?.formulario_solicitud?.usuario?.nombre} {selectedPagoForEmitir?.formulario_solicitud?.usuario?.apellido}
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                  Formulario: {selectedPagoForEmitir?.formulario_solicitud?.numero_formulario} | Monto: <strong>Bs. {selectedPagoForEmitir?.monto}</strong>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                  Nº Comprobante Físico de Caja Campus UAGRM
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: CC-889412-2026"
                  value={numComprobanteCampus}
                  onChange={(e) => setNumComprobanteCampus(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                    Fecha Inicio Membresía
                  </label>
                  <input
                    type="date"
                    required
                    value={fechaInicioMembresia}
                    onChange={(e) => setFechaInicioMembresia(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                    Fecha Fin Membresía
                  </label>
                  <input
                    type="date"
                    required
                    value={fechaFinMembresia}
                    onChange={(e) => setFechaFinMembresia(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEmitirModalOpen(false)}
                  style={{ padding: '0.55rem 1rem', borderRadius: '6px', border: '1px solid var(--color-border-strong)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={emitirInscripcionMutation.isPending}
                  style={{ padding: '0.55rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {emitirInscripcionMutation.isPending ? 'Validando...' : 'Confirmar & Emitir Boleta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VISTA PREVIA E IMPRESIÓN BOLETA DE PAGO */}
      <BoletaPagoModal
        isOpen={isPagoPrintModalOpen}
        pago={selectedPagoForPrint}
        onClose={() => setIsPagoPrintModalOpen(false)}
      />

      {/* MODAL VISTA PREVIA E IMPRESIÓN BOLETA DE INSCRIPCIÓN */}
      <BoletaInscripcionModal
        isOpen={isInscripcionViewModalOpen}
        inscripcion={selectedInscripcionForView}
        onClose={() => setIsInscripcionViewModalOpen(false)}
      />

      {/* MODAL PASE DIGITAL CÓDIGO QR */}
      <CodigoQRInscripcionModal
        isOpen={isQRModalOpen}
        inscripcionId={selectedInscripcionForQR?.id || null}
        inscripcionFallback={selectedInscripcionForQR}
        onClose={() => setIsQRModalOpen(false)}
      />

      {/* MODAL VINCULACIÓN TELEGRAM */}
      <VincularTelegramModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </section>
  );
};

export default TramitesPage;
