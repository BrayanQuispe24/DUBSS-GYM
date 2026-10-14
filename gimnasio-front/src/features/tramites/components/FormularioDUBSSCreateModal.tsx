// src/features/tramites/components/FormularioDUBSSCreateModal.tsx
import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaXmark, FaCheck, FaNotesMedical, FaHeartPulse, FaUserCheck, FaShieldHalved, FaBookOpen, FaCircleInfo, FaFolderOpen, FaPaperclip, FaFileLines, FaEye } from 'react-icons/fa6';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';

import showToast from '@/utils/toast';

interface FormularioDUBSSCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

const FormularioDUBSSCreateModal: React.FC<FormularioDUBSSCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol === 'administrador';

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [planes, setPlanes] = useState<any[]>([]);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [disciplinaHorarios, setDisciplinaHorarios] = useState<any[]>([]);
  const [userDocumentos, setUserDocumentos] = useState<any[]>([]);

  // Form Fields
  const [numeroFormulario, setNumeroFormulario] = useState('');
  const [idUsuario, setIdUsuario] = useState<number | ''>('');
  const [idDisciplina, setIdDisciplina] = useState<number | ''>('');
  const [idDisciplinaHorario, setIdDisciplinaHorario] = useState<number | ''>('');
  const [idPlan, setIdPlan] = useState<number | ''>('');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');

  // Personal Fields
  const [facultadCarrera, setFacultadCarrera] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [celular, setCelular] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState('Masculino');
  const [grupoSanguineo, setGrupoSanguineo] = useState('O+');
  const [peso, setPeso] = useState<number | ''>('');
  const [altura, setAltura] = useState<number | ''>('');

  // Health Questionnaire Fields
  const [tieneCardio, setTieneCardio] = useState(false);
  const [detCardio, setDetCardio] = useState('');

  const [tieneProcCardio, setTieneProcCardio] = useState(false);
  const [detProcCardio, setDetProcCardio] = useState('');

  const [tieneHipertension, setTieneHipertension] = useState(false);
  const [tienePulmonar, setTienePulmonar] = useState(false);
  const [tieneDiabetes, setTieneDiabetes] = useState(false);
  const [tieneOsteoarticular, setTieneOsteoarticular] = useState(false);
  const [tieneNeurologica, setTieneNeurologica] = useState(false);
  const [tieneConvulsiones, setTieneConvulsiones] = useState(false);
  const [detCondiciones, setDetCondiciones] = useState('');

  const [tieneCirugia, setTieneCirugia] = useState(false);
  const [detCirugia, setDetCirugia] = useState('');

  const [tieneFracturas, setTieneFracturas] = useState(false);
  const [detFracturas, setDetFracturas] = useState('');

  const [tieneSintomas, setTieneSintomas] = useState(false);
  const [detSintomas, setDetSintomas] = useState('');

  const [aceptaDeclaracion, setAceptaDeclaracion] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Auto-generate Form number
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setNumeroFormulario(`DUBSS-FR-03-${new Date().getFullYear()}-${randomNum}`);

      // Set default user
      if (user) {
        setIdUsuario(user.id);
        if ((user as any).celular) setCelular((user as any).celular);
      }

      // Fetch users, disciplines, plans, schedules, and disciplina-horario pivot records
      api.get('/usuarios').then((r) => setUsuarios(Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])).catch(() => {});
      api.get('/disciplinas').then((r) => setDisciplinas(Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])).catch(() => {});
      api.get('/planes').then((r) => setPlanes(Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])).catch(() => {});
      api.get('/horarios').then((r) => setHorarios(Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])).catch(() => {});
      api.get('/disciplina-horario').then((r) => setDisciplinaHorarios(Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : [])).catch(() => {});
    }
  }, [isOpen, isAdmin, user]);

  // Auto-fill user profile and clinical history whenever idUsuario changes
  useEffect(() => {
    if (!isOpen || !idUsuario) return;

    // 1. Prefill from user object in usuarios array or auth user
    const selectedUser = (usuarios || []).find((u: any) => u.id === Number(idUsuario)) || (idUsuario === user?.id ? user : null);
    if (selectedUser) {
      if (selectedUser.celular || selectedUser.telefono) {
        setCelular(selectedUser.celular || selectedUser.telefono || '');
      }
      if (selectedUser.domicilio || selectedUser.direccion) {
        setDomicilio(selectedUser.domicilio || selectedUser.direccion || '');
      }
      if (selectedUser.facultad_carrera || selectedUser.carrera || selectedUser.facultad) {
        setFacultadCarrera(selectedUser.facultad_carrera || selectedUser.carrera || selectedUser.facultad || '');
      }
      if (selectedUser.fecha_nacimiento) {
        setFechaNacimiento(String(selectedUser.fecha_nacimiento).split('T')[0]);
      }
      if (selectedUser.sexo || selectedUser.genero) {
        setSexo(selectedUser.sexo || selectedUser.genero || 'Masculino');
      }
    }

    // 2. Fetch user's existing Historial & Antecedentes to auto-fill clinical history
    api.get('/historiales').then((r) => {
      const list = Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : [];
      const userHistorial = list.find((h: any) => Number(h.id_usuario) === Number(idUsuario));
      if (userHistorial) {
        if (userHistorial.facultad_carrera) setFacultadCarrera(userHistorial.facultad_carrera);
        if (userHistorial.domicilio) setDomicilio(userHistorial.domicilio);
        if (userHistorial.celular_emergencia || userHistorial.celular) setCelular(userHistorial.celular_emergencia || userHistorial.celular);
        if (userHistorial.fecha_nacimiento) setFechaNacimiento(String(userHistorial.fecha_nacimiento).split('T')[0]);
        if (userHistorial.sexo) setSexo(userHistorial.sexo);
        if (userHistorial.grupo_sanguineo) setGrupoSanguineo(userHistorial.grupo_sanguineo);

        // Fill weight and height if details exist
        const detalles = userHistorial.detalles || [];
        if (detalles.length > 0) {
          const latestDetalle = detalles[detalles.length - 1];
          if (latestDetalle.peso) setPeso(latestDetalle.peso);
          if (latestDetalle.altura || latestDetalle.talla) setAltura(latestDetalle.altura || latestDetalle.talla);
        }

        // Fill antecedentes questionnaire
        const antList = Array.isArray(userHistorial.antecedentes)
          ? userHistorial.antecedentes
          : Array.isArray(userHistorial.antecedentes_medicos)
          ? userHistorial.antecedentes_medicos
          : [];

        if (antList.length > 0) {
          const ant = antList[0];
          if (ant.tiene_enfermedades_cardiovasculares) {
            setTieneCardio(true);
            if (ant.detalle_enfermedades_cardiovasculares) setDetCardio(ant.detalle_enfermedades_cardiovasculares);
          }
          if (ant.se_realizo_intervencion_cardiovascular) {
            setTieneProcCardio(true);
            if (ant.detalle_intervencion_cardiovascular) setDetProcCardio(ant.detalle_intervencion_cardiovascular);
          }
          if (ant.tiene_hipertension_arterial) setTieneHipertension(true);
          if (ant.tiene_enfermedades_pulmonares) setTienePulmonar(true);
          if (ant.tiene_diabetes) setTieneDiabetes(true);
          if (ant.tiene_enfermedades_osteoarticulares) setTieneOsteoarticular(true);
          if (ant.tiene_enfermedades_neurologicas) setTieneNeurologica(true);
          if (ant.tiene_convulsiones) setTieneConvulsiones(true);
          if (ant.tiene_intervencion_quirurgica) {
            setTieneCirugia(true);
            if (ant.detalle_intervencion_quirurgica) setDetCirugia(ant.detalle_intervencion_quirurgica);
          }
          if (ant.sufrio_fracturas_oseas) {
            setTieneFracturas(true);
            if (ant.detalle_fracturas_oseas) setDetFracturas(ant.detalle_fracturas_oseas);
          }
          if (ant.sufrio_algun_sintoma_durante_deporte) {
            setTieneSintomas(true);
            if (ant.detalle_sintomas_durante_deporte) setDetSintomas(ant.detalle_sintomas_durante_deporte);
          }
        }
      }
    }).catch(() => {});

    // 3. Fetch user's uploaded documents
    api.get('/documentos').then((r) => {
      const list = Array.isArray(r.data?.data) ? r.data.data : Array.isArray(r.data) ? r.data : [];
      const docs = list.filter((d: any) => Number(d.id_usuario || d.idUsuario) === Number(idUsuario));
      setUserDocumentos(docs);
    }).catch(() => setUserDocumentos([]));
  }, [idUsuario, isOpen, usuarios, user]);

  if (!isOpen) return null;

  // Filter disciplina_horario strictly by selected idDisciplina from DB
  const selectedDisc = (disciplinas || []).find((d: any) => Number(d.id) === Number(idDisciplina));
  const pivotListApi = (disciplinaHorarios || []).filter((dh: any) => Number(dh.id_disciplina) === Number(idDisciplina));
  const pivotListDisc = selectedDisc?.disciplina_horarios || selectedDisc?.disciplinaHorarios || [];
  const assignedHorariosList = pivotListApi.length > 0 ? pivotListApi : pivotListDisc;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idDisciplina || !idUsuario) {
      showToast.warning('Por favor seleccione el Usuario y la Disciplina.', 'Datos Incompletos');
      return;
    }
    if (!aceptaDeclaracion) {
      showToast.warning('Debe aceptar la Declaración Jurada para enviar la solicitud.', 'Declaración Jurada');
      return;
    }

    const payload = {
      numero_formulario: numeroFormulario,
      id_disciplina: Number(idDisciplina),
      id_disciplina_horario: idDisciplinaHorario ? Number(idDisciplinaHorario) : null,
      id_plan: idPlan ? Number(idPlan) : null,
      id_usuario: Number(idUsuario),
      horario: horarioSeleccionado,
      estado: 'pendiente',
      fecha_registro: new Date().toISOString().split('T')[0],
      facultad_carrera: facultadCarrera,
      domicilio,
      celular,
      sexo,
      grupo_sanguineo: grupoSanguineo,
      fecha_nacimiento: fechaNacimiento || null,
      peso: peso !== '' ? Number(peso) : null,
      altura: altura !== '' ? Number(altura) : null,
      antecedentes: {
        tiene_enfermedades_cardiovasculares: tieneCardio,
        detalle_enfermedades_cardiovasculares: detCardio,
        se_realizo_intervencion_cardiovascular: tieneProcCardio,
        detalle_intervencion_cardiovascular: detProcCardio,
        tiene_hipertension_arterial: tieneHipertension,
        detalle_hipertension_arterial: tieneHipertension ? detCondiciones : null,
        tiene_enfermedades_pulmonares: tienePulmonar,
        detalle_enfermedades_pulmonares: tienePulmonar ? detCondiciones : null,
        tiene_diabetes: tieneDiabetes,
        detalle_diabetes: tieneDiabetes ? detCondiciones : null,
        tiene_enfermedades_osteoarticulares: tieneOsteoarticular,
        detalle_enfermedades_osteoarticulares: tieneOsteoarticular ? detCondiciones : null,
        tiene_enfermedades_neurologicas: tieneNeurologica,
        detalle_enfermedades_neurologicas: tieneNeurologica ? detCondiciones : null,
        tiene_convulsiones: tieneConvulsiones,
        detalle_convulsiones: tieneConvulsiones ? detCondiciones : null,
        tiene_intervencion_quirurgica: tieneCirugia,
        detalle_intervencion_quirurgica: detCirugia,
        sufrio_fracturas_oseas: tieneFracturas,
        detalle_fracturas_oseas: detFracturas,
        sufrio_algun_sintoma_durante_deporte: tieneSintomas,
        detalle_sintomas_durante_deporte: detSintomas,
      },
    };

    onSubmit(payload);
  };

  if (!isOpen) return null;

  if (user?.rol !== 'cliente') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(15,23,42,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '420px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0', textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#DC2626', marginBottom: '0.75rem' }}>
            Acceso Restringido
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
            Únicamente los usuarios con rol <strong>Cliente</strong> pueden emitir solicitudes de inscripción (DUBSS-FR-03).
          </p>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem', borderRadius: '6px',
              backgroundColor: '#003B70', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(15,23,42,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '14px', width: '100%', maxWidth: '850px',
        maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
        overflow: 'hidden', border: '1px solid #CBD5E1'
      }}>
        {/* HEADER BAR */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.75rem', backgroundColor: '#0F172A', color: '#FFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FaFilePdf style={{ color: '#F59E0B', fontSize: '1.4rem' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>
                Formulario de Inscripción DUBSS-FR-03
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Completar Ficha y Cuestionario Médico para Solicitud de Membresía
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF',
              border: 'none', cursor: 'pointer', fontSize: '1.1rem', display: 'flex'
            }}
          >
            <FaXmark />
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* SECCIÓN 1: DATOS DE LA SOLICITUD */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#003B70', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaUserCheck style={{ color: '#003B70' }} /> 1. Datos de la Solicitud y Membresía
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Nº de Formulario:
                </label>
                <input
                  type="text"
                  value={numeroFormulario}
                  onChange={(e) => setNumeroFormulario(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700, backgroundColor: '#FFF' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Socio / Universitario:
                </label>
                <input
                  type="text"
                  value={user?.name || [user?.nombre, user?.apellido].filter(Boolean).join(' ') || user?.email || ''}
                  disabled
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#E2E8F0', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Disciplina Deportiva:
                </label>
                <select
                  value={idDisciplina}
                  onChange={(e) => {
                    const discId = e.target.value ? Number(e.target.value) : '';
                    setIdDisciplina(discId);
                    setIdDisciplinaHorario('');
                    setHorarioSeleccionado('');
                  }}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFF' }}
                  required
                >
                  <option value="">-- Seleccionar Disciplina --</option>
                  {disciplinas.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Plan de Membresía / Tarifa:
                </label>
                <select
                  value={idPlan}
                  onChange={(e) => setIdPlan(e.target.value ? Number(e.target.value) : '')}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFF' }}
                  required
                >
                  <option value="">-- Seleccionar Plan de Membresía --</option>
                  {planes.map((p: any) => {
                    const precio = p.tarifa?.precio ? `Bs. ${Number(p.tarifa.precio).toFixed(2)}` : 'Bs. 150.00';
                    return (
                      <option key={p.id} value={p.id}>
                        {p.nombre} ({precio} - {p.duracion_dias || 30} días)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Horario / Turno de Asistencia (Cupos):
                </label>
                <select
                  value={idDisciplinaHorario}
                  onChange={(e) => {
                    const dhId = e.target.value ? Number(e.target.value) : '';
                    setIdDisciplinaHorario(dhId);
                    const selDh = assignedHorariosList.find((dh: any) => Number(dh.id) === Number(dhId));
                    if (selDh) {
                      const h = selDh.horario || selDh;
                      const formatTime = (t?: string) => t ? String(t).slice(0, 5) : '';
                      const str = `${h.dia_semana ? h.dia_semana + ': ' : ''}${formatTime(h.hora_inicio || h.inicio)} - ${formatTime(h.hora_fin || h.fin)}`.trim();
                      setHorarioSeleccionado(str);
                    } else {
                      setHorarioSeleccionado('');
                    }
                  }}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFF' }}
                  required
                  disabled={!idDisciplina}
                >
                  <option value="">
                    {!idDisciplina ? '-- Primero seleccione una Disciplina --' : '-- Seleccionar Horario de BD --'}
                  </option>
                  {assignedHorariosList.length > 0 ? (
                    assignedHorariosList.map((dh: any) => {
                      const h = dh.horario || dh;
                      if (!h) return null;
                      const formatTime = (t?: string) => t ? String(t).slice(0, 5) : '';
                      const str = `${h.dia_semana ? h.dia_semana + ': ' : ''}${formatTime(h.hora_inicio || h.inicio)} - ${formatTime(h.hora_fin || h.fin)}`.trim();
                      if (!str || str === '-') return null;
                      
                      const disp = dh.cupos_disponibles !== undefined ? dh.cupos_disponibles : (dh.cupo_maximo ?? '∞');
                      const max = dh.cupo_maximo ?? '∞';
                      const isAgotado = typeof disp === 'number' && disp <= 0;

                      return (
                        <option key={dh.id || `${dh.id_disciplina}-${dh.id_horario}`} value={dh.id} disabled={isAgotado}>
                          {str} — {isAgotado ? 'SIN CUPOS DISPONIBLES' : `Cupos disp: ${disp}/${max}`}
                        </option>
                      );
                    })
                  ) : idDisciplina ? (
                    <option value="" disabled>-- Sin horarios asignados en la tabla disciplina_horario --</option>
                  ) : null}
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: DATOS PERSONALES DEL SOCIO */}
          <div style={{ backgroundColor: '#FFF', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#003B70', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaNotesMedical style={{ color: '#0284C7' }} /> 2. Datos Personales & Físicos del Socio
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Facultad / Carrera / Unidad:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Facultad de Cs. de la Computación"
                  value={facultadCarrera}
                  onChange={(e) => setFacultadCarrera(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Domicilio Actual:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Av. Busch 2do Anillo"
                  value={domicilio}
                  onChange={(e) => setDomicilio(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Celular:
                </label>
                <input
                  type="text"
                  placeholder="Ej: 77012345"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Fecha de Nacimiento:
                </label>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Sexo:
                </label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFF' }}
                >
                  <option value="Masculino">Masculino (M)</option>
                  <option value="Femenino">Femenino (F)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Grupo Sanguíneo:
                </label>
                <input
                  type="text"
                  placeholder="Ej: O+, A+, B-"
                  value={grupoSanguineo}
                  onChange={(e) => setGrupoSanguineo(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Peso (kg):
                </label>
                <input
                  type="number"
                  placeholder="Ej: 70"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value ? Number(e.target.value) : '')}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Altura (cm):
                </label>
                <input
                  type="number"
                  placeholder="Ej: 175"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value ? Number(e.target.value) : '')}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: CUESTIONARIO MÉDICO */}
          <div style={{ backgroundColor: '#FFF', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#003B70', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaHeartPulse style={{ color: '#DC2626' }} /> 3. Cuestionario Médico – Gimnasio Universitario
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem', fontStyle: 'italic' }}>
              Por favor responda con sinceridad las siguientes preguntas sobre su salud:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              {/* CARDIO */}
              <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <label style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={tieneCardio} onChange={(e) => setTieneCardio(e.target.checked)} />
                  ¿Tiene antecedentes de enfermedades cardiovasculares?
                </label>
                {tieneCardio && (
                  <input
                    type="text"
                    placeholder="Especifique antecedentes cardiovasculares..."
                    value={detCardio}
                    onChange={(e) => setDetCardio(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', marginTop: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                )}
              </div>

              {/* PROCEDIMIENTO CARDIO */}
              <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <label style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={tieneProcCardio} onChange={(e) => setTieneProcCardio(e.target.checked)} />
                  ¿Se le ha realizado algún procedimiento cardiovascular (bypass, marcapasos, angioplastia, etc.)?
                </label>
                {tieneProcCardio && (
                  <input
                    type="text"
                    placeholder="Especifique procedimiento cardiovascular..."
                    value={detProcCardio}
                    onChange={(e) => setDetProcCardio(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', marginTop: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                )}
              </div>

              {/* CONDICIONES ESPECIFICAS */}
              <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.5rem' }}>
                  Marque si padece alguna de las siguientes condiciones:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={tieneHipertension} onChange={(e) => setTieneHipertension(e.target.checked)} /> Hipertensión Arterial
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={tienePulmonar} onChange={(e) => setTienePulmonar(e.target.checked)} /> Enfermedades Pulmonares / Asma
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={tieneDiabetes} onChange={(e) => setTieneDiabetes(e.target.checked)} /> Diabetes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={tieneOsteoarticular} onChange={(e) => setTieneOsteoarticular(e.target.checked)} /> Enf. Osteoarticulares
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={tieneNeurologica} onChange={(e) => setTieneNeurologica(e.target.checked)} /> Enf. Neurológicas
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={tieneConvulsiones} onChange={(e) => setTieneConvulsiones(e.target.checked)} /> Convulsiones
                  </label>
                </div>
                {(tieneHipertension || tienePulmonar || tieneDiabetes || tieneOsteoarticular || tieneNeurologica || tieneConvulsiones) && (
                  <input
                    type="text"
                    placeholder="Detalle sobre la(s) condición(es) marcada(s)..."
                    value={detCondiciones}
                    onChange={(e) => setDetCondiciones(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', marginTop: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                )}
              </div>

              {/* CIRUGIAS */}
              <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <label style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={tieneCirugia} onChange={(e) => setTieneCirugia(e.target.checked)} />
                  ¿Le realizaron alguna intervención quirúrgica?
                </label>
                {tieneCirugia && (
                  <input
                    type="text"
                    placeholder="Especifique intervención quirúrgica..."
                    value={detCirugia}
                    onChange={(e) => setDetCirugia(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', marginTop: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                )}
              </div>

              {/* FRACTURAS */}
              <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <label style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={tieneFracturas} onChange={(e) => setTieneFracturas(e.target.checked)} />
                  ¿Ha sufrido fracturas óseas?
                </label>
                {tieneFracturas && (
                  <input
                    type="text"
                    placeholder="Especifique fracturas óseas..."
                    value={detFracturas}
                    onChange={(e) => setDetFracturas(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', marginTop: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                )}
              </div>

              {/* SINTOMAS DEPORTIVOS */}
              <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <label style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={tieneSintomas} onChange={(e) => setTieneSintomas(e.target.checked)} />
                  ¿Ha sufrido durante el deporte deshidratación, mareos, obnubilación o pérdida de conocimiento?
                </label>
                {tieneSintomas && (
                  <input
                    type="text"
                    placeholder="Detalle el episodio..."
                    value={detSintomas}
                    onChange={(e) => setDetSintomas(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', marginTop: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* SECCIÓN 3.5: DOCUMENTACIÓN DIGITAL ADJUNTA DEL POSTULANTE */}
          <div style={{ backgroundColor: '#FFF', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#003B70', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaFolderOpen style={{ color: '#D97706' }} /> 3.5. Documentación Adjunta del Postulante / Socio
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>
              Archivos digitales y requisitos registrados previamente en el sistema para verificación:
            </p>

            {userDocumentos.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {userDocumentos.map((doc: any) => {
                  const nombreTipo = doc.tipo_documento?.nombre || doc.tipoDocumento?.nombre || 'Documento Adjunto';
                  const fileUrl = doc.archivo_url || doc.ruta_archivo;
                  return (
                    <div key={doc.id} style={{
                      padding: '0.75rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                        <FaFileLines style={{ color: '#003B70', fontSize: '1.2rem', flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{nombreTipo}</div>
                          <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <FaCheck size={10} /> Cargado en Sistema
                          </span>
                        </div>
                      </div>
                      {fileUrl && (
                        <a
                          href={fileUrl.startsWith('http') ? fileUrl : `http://localhost:8000${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '0.3rem 0.6rem', borderRadius: '5px', backgroundColor: '#003B70', color: '#FFF',
                            fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0
                          }}
                        >
                          <FaEye /> Ver
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaPaperclip style={{ fontSize: '1.1rem', flexShrink: 0 }} />
                <span>
                  No se encontraron archivos digitales registrados previamente para este usuario. El postulante podrá presentar sus fotocopias (C.I., Matrícula Universitaria) en administración al momento del control.
                </span>
              </div>
            )}
          </div>

          {/* SECCIÓN 4: REGLAMENTO INTERNO Y DECLARACIÓN JURADA */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#003B70', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaShieldHalved style={{ color: '#003B70' }} /> 4. Reglamento Interno del Gimnasio & Declaración Jurada
            </h4>
            
            {/* REGLAMENTO INTERNO BOX */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaBookOpen style={{ color: '#0284C7' }} /> Normas y Condiciones para el Uso del Gimnasio Universitario (DUBSS-UAGRM):
              </h5>
              <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.4' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <strong style={{ color: '#003B70', whiteSpace: 'nowrap' }}>1. Reserva y Frecuencia:</strong>
                  <span>La reserva de cupo es personal e intransferible. El socio solo puede realizar <strong>1 solicitud por disciplina al mes</strong> y debe asistir en el horario/turno registrado.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <strong style={{ color: '#003B70', whiteSpace: 'nowrap' }}>2. Certificado Médico:</strong>
                  <span>En caso de haber respondido afirmativamente en el Cuestionario Médico (Sección 3), el socio se compromete a presentar su <strong>Certificado de Aptitud Física emitido por médico colegiado</strong> en un plazo máximo de <strong>15 días</strong> en administración.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <strong style={{ color: '#003B70', whiteSpace: 'nowrap' }}>3. Indumentaria e Higiene:</strong>
                  <span>Es de carácter obligatorio el uso de ropa deportiva adecuada, zapatillas limpias de uso exclusivo para las salas y <strong>toalla personal</strong> para la desinfección de equipos.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <strong style={{ color: '#003B70', whiteSpace: 'nowrap' }}>4. Deslinde Legal:</strong>
                  <span>El Gimnasio Universitario UAGRM queda eximido de cualquier responsabilidad civil o penal por accidentes o descompensaciones provocadas por la omisión de antecedentes médicos o uso negligente de los aparatos.</span>
                </div>
              </div>
            </div>

            {/* DECLARACIÓN JURADA BOX */}
            <div style={{ backgroundColor: '#FEF3C7', padding: '1rem', borderRadius: '8px', border: '1px solid #FCD34D' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FaCircleInfo style={{ color: '#D97706', fontSize: '1rem', marginTop: '0.15rem', flexShrink: 0 }} />
                <p style={{ fontSize: '0.8rem', color: '#78350F', lineHeight: '1.4', margin: 0, fontWeight: 600 }}>
                  <strong>DECLARACIÓN JURADA DUBSS-FR-03:</strong> Declaro bajo juramento que los datos ingresados en esta ficha y cuestionario médico son exactos y verdaderos. Acepto el Reglamento Interno y me comprometo a cumplir todas sus disposiciones sanitarias y disciplinares.
                </p>
              </div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#78350F', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed #F59E0B' }}>
                <input
                  type="checkbox"
                  checked={aceptaDeclaracion}
                  onChange={(e) => setAceptaDeclaracion(e.target.checked)}
                />
                He leído, acepto el Reglamento Interno y firmo digitalmente la Declaración Jurada (DUBSS-FR-03)
              </label>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.25rem', borderRadius: '8px', backgroundColor: '#F1F5F9', color: '#475569',
                border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '0.65rem 1.5rem', borderRadius: '8px',
                background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)',
                color: '#FFF', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isPending ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(0, 59, 112, 0.25)'
              }}
            >
              <FaCheck /> {isPending ? 'Guardando Solicitud...' : 'Guardar y Enviar Solicitud DUBSS-FR-03'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioDUBSSCreateModal;
