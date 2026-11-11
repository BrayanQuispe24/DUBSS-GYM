// src/features/booking/components/BookingModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '@/components/ui/Modal';
import { useBookingStore } from '../store/bookingStore';
import { useBookingSolicitud } from '../hooks/useBookingSolicitud';
import { usePublicLanding } from '@/features/landing/hooks/usePublicLanding';
import { formatHorarioLabel } from '@/features/landing/utils/disciplinaVisuals';
import { useAuthStore } from '@/store/authStore';
import type { FormularioSolicitud } from '@/features/tramites/services/tramiteService';
import { QrCode, CheckCircle, User, Phone, GraduationCap, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const authenticatedSchema = z.object({
  idPlan: z.string().min(1, 'Selecciona un plan de membresía'),
  idDisciplina: z.string().min(1, 'Selecciona una disciplina'),
  idDisciplinaHorario: z.string().optional(),
});

const guestSchema = z
  .object({
    idPlan: z.string().min(1, 'Selecciona un plan de membresía'),
    idDisciplina: z.string().min(1, 'Selecciona una disciplina'),
    idDisciplinaHorario: z.string().optional(),
    nombre: z.string().min(2, 'El nombre es requerido'),
    apellido: z.string().min(2, 'El apellido es requerido'),
    registroUagrm: z.string().min(4, 'Registro Universitario requerido'),
    ci: z.string().min(5, 'Cédula de Identidad requerida'),
    celular: z.string().min(7, 'Número de teléfono requerido'),
    tipoUsuario: z.enum(['estudiante', 'docente', 'administrativo', 'particular']),
    email: z.string().email('Ingresa un correo electrónico válido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    passwordConfirmation: z.string().min(8, 'Confirma tu contraseña'),
    aceptaTerminos: z.literal(true, {
      errorMap: () => ({ message: 'Debes aceptar los términos y condiciones' }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirmation'],
  });

type GuestFormData = z.infer<typeof guestSchema>;
type AuthFormData = z.infer<typeof authenticatedSchema>;

const extractApiError = (err: unknown): string => {
  const axiosErr = err as {
    response?: {
      data?: {
        message?: string;
        errors?: Record<string, string[]>;
      };
    };
  };
  const errors = axiosErr?.response?.data?.errors;
  if (errors) {
    const firstMsg = Object.values(errors).flat()[0];
    if (firstMsg) return firstMsg;
  }
  return axiosErr?.response?.data?.message || 'Ocurrió un error al procesar la solicitud.';
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface, #14141A)',
  color: 'var(--color-text-primary, #fff)',
  fontSize: '0.88rem',
};

const BookingModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isModalOpen,
    closeModal,
    selectedSpot,
    selectedPrice,
    selectedDisciplinaId,
    selectedHorarioId,
    selectedPlanId,
    prefillRu,
    prefillCi,
    prefillUserType,
  } = useBookingStore();

  const { user, isAuthenticated } = useAuthStore();
  const { data: landingData } = usePublicLanding();
  const { submitAuthenticated, submitGuest, isPending } = useBookingSolicitud();

  const [createdSolicitud, setCreatedSolicitud] = useState<FormularioSolicitud | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const disciplinas = useMemo(() => landingData?.disciplinas ?? [], [landingData]);
  const planes = useMemo(() => landingData?.planes ?? [], [landingData]);

  const isClienteAuth = isAuthenticated && user?.rol === 'cliente';
  const isStaffAuth = isAuthenticated && user && user.rol !== 'cliente';

  const authForm = useForm<AuthFormData>({
    resolver: zodResolver(authenticatedSchema),
    defaultValues: {
      idPlan: '',
      idDisciplina: '',
      idDisciplinaHorario: '',
    },
  });

  const guestForm = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      idPlan: '',
      idDisciplina: '',
      idDisciplinaHorario: '',
      nombre: '',
      apellido: '',
      registroUagrm: '',
      ci: '',
      celular: '',
      tipoUsuario: 'estudiante',
      email: '',
      password: '',
      passwordConfirmation: '',
      aceptaTerminos: true,
    },
  });

  const { reset: resetAuth, setValue: setAuthValue, getValues: getAuthValues } = authForm;
  const { reset: resetGuest, setValue: setGuestValue, getValues: getGuestValues } = guestForm;

  // Reset form state only when the modal opens
  useEffect(() => {
    if (!isModalOpen) return;
    setServerError(null);

    const defaultPlan = planes.find((p) => p.id === selectedPlanId) ?? planes[0];
    const defaultDisc = disciplinas.find((d) => d.id === selectedDisciplinaId) ?? disciplinas[0];
    const defaultHor =
      defaultDisc?.horarios.find((h) => h.id === selectedHorarioId && h.cupos_disponibles > 0) ??
      defaultDisc?.horarios.find((h) => h.cupos_disponibles > 0) ??
      defaultDisc?.horarios[0];

    const planVal = defaultPlan ? String(defaultPlan.id) : '';
    const discVal = defaultDisc ? String(defaultDisc.id) : '';
    const horVal = defaultHor ? String(defaultHor.id) : '';

    resetAuth({
      idPlan: planVal,
      idDisciplina: discVal,
      idDisciplinaHorario: horVal,
    });

    resetGuest({
      idPlan: planVal,
      idDisciplina: discVal,
      idDisciplinaHorario: horVal,
      nombre: '',
      apellido: '',
      registroUagrm: prefillRu || '',
      ci: prefillCi || '',
      celular: '',
      tipoUsuario: prefillUserType || 'estudiante',
      email: '',
      password: '',
      passwordConfirmation: '',
      aceptaTerminos: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, selectedPlanId, selectedDisciplinaId, selectedHorarioId, prefillRu, prefillCi, prefillUserType, resetAuth, resetGuest]);

  // Populate catalog defaults if landingData finishes loading while modal is already open
  useEffect(() => {
    if (!isModalOpen) return;

    if (planes.length > 0) {
      const targetPlan = planes.find((p) => p.id === selectedPlanId) ?? planes[0];
      if (!getAuthValues('idPlan')) setAuthValue('idPlan', String(targetPlan.id));
      if (!getGuestValues('idPlan')) setGuestValue('idPlan', String(targetPlan.id));
    }

    if (disciplinas.length > 0) {
      const targetDisc = disciplinas.find((d) => d.id === selectedDisciplinaId) ?? disciplinas[0];
      const targetHor =
        targetDisc.horarios.find((h) => h.id === selectedHorarioId && h.cupos_disponibles > 0) ??
        targetDisc.horarios.find((h) => h.cupos_disponibles > 0) ??
        targetDisc.horarios[0];

      if (!getAuthValues('idDisciplina')) {
        setAuthValue('idDisciplina', String(targetDisc.id));
        setAuthValue('idDisciplinaHorario', targetHor ? String(targetHor.id) : '');
      }
      if (!getGuestValues('idDisciplina')) {
        setGuestValue('idDisciplina', String(targetDisc.id));
        setGuestValue('idDisciplinaHorario', targetHor ? String(targetHor.id) : '');
      }
    }
  }, [isModalOpen, planes, disciplinas, selectedPlanId, selectedDisciplinaId, selectedHorarioId, getAuthValues, getGuestValues, setAuthValue, setGuestValue]);

  const watchedDiscId = isClienteAuth
    ? authForm.watch('idDisciplina')
    : guestForm.watch('idDisciplina');

  const watchedPlanId = isClienteAuth
    ? authForm.watch('idPlan')
    : guestForm.watch('idPlan');

  const activeDisciplina = useMemo(
    () => disciplinas.find((d) => String(d.id) === String(watchedDiscId)),
    [disciplinas, watchedDiscId]
  );

  const activePlan = useMemo(
    () => planes.find((p) => String(p.id) === String(watchedPlanId)),
    [planes, watchedPlanId]
  );

  const activeHorarios = activeDisciplina?.horarios ?? [];
  const hasHorariosConfigured = activeHorarios.length > 0;
  const hasAvailableSlot = !hasHorariosConfigured || activeHorarios.some((h) => h.cupos_disponibles > 0);

  // Auto-update horario when discipline changes
  useEffect(() => {
    if (!activeDisciplina) return;
    const firstAvailable =
      activeDisciplina.horarios.find((h) => h.cupos_disponibles > 0) ?? activeDisciplina.horarios[0];
    const nextHorId = firstAvailable ? String(firstAvailable.id) : '';

    if (isClienteAuth) {
      setAuthValue('idDisciplinaHorario', nextHorId);
    } else {
      setGuestValue('idDisciplinaHorario', nextHorId);
    }
  }, [activeDisciplina, isClienteAuth, setAuthValue, setGuestValue]);

  const handleClose = () => {
    setCreatedSolicitud(null);
    setServerError(null);
    closeModal();
  };

  const onSubmitAuthenticated = async (values: AuthFormData) => {
    if (!user) return;
    setServerError(null);

    if (hasHorariosConfigured) {
      const selectedH = activeHorarios.find((h) => String(h.id) === String(values.idDisciplinaHorario));
      if (!selectedH || selectedH.cupos_disponibles <= 0) {
        setServerError('Selecciona un turno con cupos disponibles.');
        return;
      }
    }

    try {
      const solicitud = await submitAuthenticated.mutateAsync({
        id_usuario: user.id,
        id_disciplina: Number(values.idDisciplina),
        id_disciplina_horario: values.idDisciplinaHorario ? Number(values.idDisciplinaHorario) : undefined,
        id_plan: values.idPlan ? Number(values.idPlan) : undefined,
        celular: user.telefono || undefined,
      });
      setCreatedSolicitud(solicitud);
    } catch (err) {
      setServerError(extractApiError(err));
    }
  };

  const onSubmitGuest = async (values: GuestFormData) => {
    setServerError(null);

    if (hasHorariosConfigured) {
      const selectedH = activeHorarios.find((h) => String(h.id) === String(values.idDisciplinaHorario));
      if (!selectedH || selectedH.cupos_disponibles <= 0) {
        setServerError('Selecciona un turno con cupos disponibles.');
        return;
      }
    }

    try {
      const solicitud = await submitGuest.mutateAsync({
        nombre: values.nombre.trim(),
        apellido: values.apellido.trim(),
        email: values.email.trim(),
        registro_universitario: values.registroUagrm.trim(),
        ci: values.ci.trim(),
        celular: values.celular.trim(),
        tipo_usuario: values.tipoUsuario,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
        id_disciplina: Number(values.idDisciplina),
        id_disciplina_horario: values.idDisciplinaHorario ? Number(values.idDisciplinaHorario) : undefined,
        id_plan: values.idPlan ? Number(values.idPlan) : undefined,
      });
      setCreatedSolicitud(solicitud);
    } catch (err) {
      setServerError(extractApiError(err));
    }
  };

  const renderPlanAndDisciplinaSelectors = (isAuthMode: boolean) => {
    const regPlan = isAuthMode ? authForm.register('idPlan') : guestForm.register('idPlan');
    const regDisc = isAuthMode ? authForm.register('idDisciplina') : guestForm.register('idDisciplina');
    const regHor = isAuthMode
      ? authForm.register('idDisciplinaHorario')
      : guestForm.register('idDisciplinaHorario');

    const errors = isAuthMode ? authForm.formState.errors : guestForm.formState.errors;

    return (
      <>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Plan / Tarifa de Membresía:
          </label>
          <select {...regPlan} style={inputStyle}>
            {planes.length === 0 && <option value="">No hay planes activos disponibles</option>}
            {planes.map((plan) => (
              <option key={plan.id} value={String(plan.id)}>
                {plan.nombre} — Bs. {Number(plan.tarifa.precio).toFixed(0)} ({plan.duracion_dias} días)
              </option>
            ))}
          </select>
          {errors.idPlan && (
            <span style={{ color: 'var(--color-danger)', fontSize: '0.76rem' }}>{errors.idPlan.message}</span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Disciplina:
            </label>
            <select {...regDisc} style={inputStyle}>
              {disciplinas.length === 0 && <option value="">Sin disciplinas activas</option>}
              {disciplinas.map((disc) => (
                <option key={disc.id} value={String(disc.id)}>
                  {disc.nombre} ({disc.total_cupos_disponibles} disp.)
                </option>
              ))}
            </select>
            {errors.idDisciplina && (
              <span style={{ color: 'var(--color-danger)', fontSize: '0.76rem' }}>{errors.idDisciplina.message}</span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Turno / Horario:
            </label>
            <select {...regHor} style={inputStyle} disabled={!hasHorariosConfigured}>
              {!hasHorariosConfigured && <option value="">Horario general en sede</option>}
              {activeHorarios.map((h) => (
                <option key={h.id} value={String(h.id)} disabled={h.cupos_disponibles <= 0}>
                  {formatHorarioLabel(h)} ({h.cupos_disponibles > 0 ? `${h.cupos_disponibles} cupos` : 'Lleno'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </>
    );
  };

  return (
    <Modal isOpen={isModalOpen} onClose={handleClose}>
      <div className="modal-header">
        <div className="modal-icon" style={{ background: 'var(--color-primary)', color: '#fff' }}>
          <QrCode size={28} />
        </div>
        <h3 id="modal-title" style={{ fontSize: '1.35rem', fontWeight: 800 }}>
          {createdSolicitud ? '¡Solicitud Registrada en el Sistema!' : 'Solicitud de Inscripción D.U.B.S.'}
        </h3>
        <p id="modal-subtitle" style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginTop: '0.3rem' }}>
          {createdSolicitud
            ? 'Tu formulario ha sido creado y está pendiente de aprobación en recepción / caja.'
            : `Dirección Universitaria de Bienestar Social • ${selectedSpot || 'Gimnasio UAGRM'}`}
        </p>
      </div>

      <div className="modal-body">
        {createdSolicitud ? (
          <div style={{ textAlign: 'center', padding: '0.8rem 0' }}>
            <CheckCircle size={48} style={{ color: 'var(--color-success)', margin: '0 auto 0.9rem' }} />

            <div style={{ background: 'linear-gradient(145deg, #16161C 0%, #3A0A0A 100%)', border: '1px solid rgba(220, 38, 38, 0.4)', color: '#fff', padding: '1.4rem', borderRadius: '18px', marginBottom: '1.1rem' }}>
              <div style={{ fontSize: '0.74rem', color: '#F87171', fontWeight: 800 }}>NÚMERO DE FORMULARIO OFICIAL</div>
              <div style={{ fontSize: '1.55rem', fontWeight: 800, letterSpacing: '0.06em', margin: '0.45rem 0', color: '#fff' }}>
                {createdSolicitud.numero_formulario}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                Disciplina: <strong>{createdSolicitud.disciplina?.nombre || activeDisciplina?.nombre}</strong><br />
                Plan: <strong>{createdSolicitud.plan?.nombre || activePlan?.nombre}</strong>
                {createdSolicitud.plan?.tarifa?.precio != null
                  ? ` (Bs. ${Number(createdSolicitud.plan.tarifa.precio).toFixed(0)})`
                  : ''}
                <br />
                Estado: <strong style={{ color: '#FBBF24', textTransform: 'uppercase' }}>{createdSolicitud.estado}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={() => {
                  handleClose();
                  navigate('/dashboard/tramites');
                }}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.78rem', borderRadius: '999px', fontWeight: 800, cursor: 'pointer', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                Ver Estado en Mis Trámites <ArrowRight size={16} />
              </button>

              <button
                onClick={handleClose}
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.72rem', borderRadius: '999px', fontWeight: 700, cursor: 'pointer' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : isStaffAuth ? (
          <div style={{ textAlign: 'center', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#1A1A22', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '1rem', borderRadius: '10px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Has iniciado sesión como <strong>{user?.name}</strong> ({user?.rol}). Las solicitudes de inscripción pública corresponden al perfil <strong>Cliente</strong>. Puedes gestionar solicitudes desde el panel administrativo.
            </div>
            <button
              onClick={() => {
                handleClose();
                navigate('/dashboard/tramites');
              }}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '999px', fontWeight: 800, background: 'var(--color-primary)', cursor: 'pointer' }}
            >
              Ir al Módulo de Trámites
            </button>
          </div>
        ) : isClienteAuth ? (
          <form onSubmit={authForm.handleSubmit(onSubmitAuthenticated)} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ background: '#1A1A22', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.86rem' }}>
              <div style={{ fontWeight: 800, color: '#F87171' }}>{user?.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                R.U.: {user?.registro_universitario || '—'} • C.I.: {user?.ci || '—'} • {activePlan ? `${activePlan.nombre} (Bs. ${Number(activePlan.tarifa.precio).toFixed(0)})` : selectedPrice}
              </div>
            </div>

            {serverError && (
              <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.45)', color: '#FCA5A5', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            {renderPlanAndDisciplinaSelectors(true)}

            <button
              type="submit"
              disabled={isPending || planes.length === 0 || disciplinas.length === 0 || !hasAvailableSlot}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.8rem', fontWeight: 800, borderRadius: '999px', marginTop: '0.3rem', cursor: 'pointer', background: 'var(--color-primary)', opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? 'Registrando Solicitud...' : 'Enviar Solicitud de Inscripción'}
            </button>
          </form>
        ) : (
          <form onSubmit={guestForm.handleSubmit(onSubmitGuest)} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ background: '#1A1A22', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.7rem 0.9rem', borderRadius: '10px', fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#F87171' }}>
                  {activePlan ? activePlan.nombre : selectedSpot}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  {activePlan ? `Bs. ${Number(activePlan.tarifa.precio).toFixed(0)} / ${activePlan.duracion_dias} días` : selectedPrice}
                </div>
              </div>
              <Link to="/login" onClick={handleClose} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F87171', textDecoration: 'underline' }}>
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>

            {serverError && (
              <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.45)', color: '#FCA5A5', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            {renderPlanAndDisciplinaSelectors(false)}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <User size={12} style={{ display: 'inline', marginRight: '0.25rem' }} /> Nombres:
                </label>
                <input type="text" {...guestForm.register('nombre')} placeholder="Ej. Carlos" style={inputStyle} />
                {guestForm.formState.errors.nombre && (
                  <span style={{ color: 'var(--color-danger)', fontSize: '0.74rem' }}>{guestForm.formState.errors.nombre.message}</span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  Apellidos:
                </label>
                <input type="text" {...guestForm.register('apellido')} placeholder="Ej. Mendoza" style={inputStyle} />
                {guestForm.formState.errors.apellido && (
                  <span style={{ color: 'var(--color-danger)', fontSize: '0.74rem' }}>{guestForm.formState.errors.apellido.message}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <GraduationCap size={12} style={{ display: 'inline', marginRight: '0.25rem' }} /> Reg. Univ. (R.U.):
                </label>
                <input type="text" {...guestForm.register('registroUagrm')} placeholder="Ej. 219084920" style={inputStyle} />
                {guestForm.formState.errors.registroUagrm && (
                  <span style={{ color: 'var(--color-danger)', fontSize: '0.74rem' }}>{guestForm.formState.errors.registroUagrm.message}</span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  Cédula (C.I.):
                </label>
                <input type="text" {...guestForm.register('ci')} placeholder="Ej. 9847120 SC" style={inputStyle} />
                {guestForm.formState.errors.ci && (
                  <span style={{ color: 'var(--color-danger)', fontSize: '0.74rem' }}>{guestForm.formState.errors.ci.message}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <Phone size={12} style={{ display: 'inline', marginRight: '0.25rem' }} /> Teléfono / WhatsApp:
                </label>
                <input type="text" {...guestForm.register('celular')} placeholder="Ej. 77312345" style={inputStyle} />
                {guestForm.formState.errors.celular && (
                  <span style={{ color: 'var(--color-danger)', fontSize: '0.74rem' }}>{guestForm.formState.errors.celular.message}</span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  Perfil UAGRM:
                </label>
                <select {...guestForm.register('tipoUsuario')} style={inputStyle}>
                  <option value="estudiante">Estudiante UAGRM</option>
                  <option value="docente">Docente UAGRM</option>
                  <option value="administrativo">Administrativo UAGRM</option>
                  <option value="particular">Particular</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                <Mail size={12} style={{ display: 'inline', marginRight: '0.25rem' }} /> Correo Electrónico:
              </label>
              <input type="email" {...guestForm.register('email')} placeholder="estudiante@uagrm.edu.bo" style={inputStyle} />
              {guestForm.formState.errors.email && (
                <span style={{ color: 'var(--color-danger)', fontSize: '0.74rem' }}>{guestForm.formState.errors.email.message}</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <Lock size={12} style={{ display: 'inline', marginRight: '0.25rem' }} /> Contraseña (mín. 8):
                </label>
                <input type="password" {...guestForm.register('password')} placeholder="••••••••" style={inputStyle} />
                {guestForm.formState.errors.password && (
                  <span style={{ color: 'var(--color-danger)', fontSize: '0.74rem' }}>{guestForm.formState.errors.password.message}</span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  Confirmar Contraseña:
                </label>
                <input type="password" {...guestForm.register('passwordConfirmation')} placeholder="••••••••" style={inputStyle} />
                {guestForm.formState.errors.passwordConfirmation && (
                  <span style={{ color: 'var(--color-danger)', fontSize: '0.74rem' }}>{guestForm.formState.errors.passwordConfirmation.message}</span>
                )}
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" {...guestForm.register('aceptaTerminos')} />
              <span>Acepto los términos y reglamento del Gimnasio Universitario D.U.B.S.</span>
            </label>
            {guestForm.formState.errors.aceptaTerminos && (
              <span style={{ color: 'var(--color-danger)', fontSize: '0.74rem' }}>{guestForm.formState.errors.aceptaTerminos.message}</span>
            )}

            <button
              type="submit"
              disabled={isPending || planes.length === 0 || disciplinas.length === 0 || !hasAvailableSlot}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.78rem', fontWeight: 800, borderRadius: '999px', marginTop: '0.2rem', cursor: 'pointer', background: 'var(--color-primary)', opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? 'Creando Cuenta y Solicitud...' : 'Registrarme y Enviar Solicitud'}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default BookingModal;
