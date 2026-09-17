// src/features/booking/components/BookingModal.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import { useBookingStore } from '../store/bookingStore';
import { QrCode, CheckCircle, User, Phone, GraduationCap } from 'lucide-react';

const bookingSchema = z.object({
  fullName: z.string().min(3, 'El nombre completo es requerido'),
  registroUagrm: z.string().min(5, 'Registro Universitario o C.I. requerido'),
  userType: z.enum(['estudiante', 'docente_admin']),
  discipline: z.string().min(1, 'Selecciona una disciplina'),
  phone: z.string().min(7, 'El número de teléfono es requerido'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingModal: React.FC = () => {
  const { isModalOpen, closeModal, selectedSpot, selectedPrice } = useBookingStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedData, setConfirmedData] = useState<BookingFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: '',
      registroUagrm: '',
      userType: 'estudiante',
      discipline: 'Gimnasio & Aparatos',
      phone: '',
    },
  });

  const onSubmit = (data: BookingFormData) => {
    setConfirmedData(data);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setConfirmedData(null);
    reset();
    closeModal();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={handleClose}>
      <div className="modal-header">
        <div className="modal-icon" style={{ background: 'var(--color-primary)', color: '#fff' }}>
          <QrCode size={28} />
        </div>
        <h3 id="modal-title" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
          {isSuccess ? '¡Inscripción UAGRM Exitosa!' : 'Inscripción a Membresía UAGRM'}
        </h3>
        <p id="modal-subtitle" style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '0.3rem' }}>
          {isSuccess
            ? 'Presenta tu carnet o código QR en la recepción para la activación de tu acceso.'
            : `Dirección Universitaria de Bienestar Social • ${selectedSpot}`}
        </p>
      </div>

      <div className="modal-body">
        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--color-background)', padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.9rem' }}>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{selectedSpot}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Tarifa: {selectedPrice}</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <User size={12} style={{ display: 'inline', marginRight: '0.3rem' }} /> Nombre y Apellidos:
              </label>
              <input
                type="text"
                {...register('fullName')}
                placeholder="Ej. Carlos Mendoza Aguilera"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                }}
              />
              {errors.fullName && (
                <span style={{ color: 'var(--color-danger)', fontSize: '0.78rem' }}>{errors.fullName.message}</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <GraduationCap size={12} style={{ display: 'inline', marginRight: '0.3rem' }} /> Reg. Univ. / C.I.:
                </label>
                <input
                  type="text"
                  {...register('registroUagrm')}
                  placeholder="Ej. 219084920"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                  }}
                />
                {errors.registroUagrm && (
                  <span style={{ color: 'var(--color-danger)', fontSize: '0.78rem' }}>{errors.registroUagrm.message}</span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Phone size={12} style={{ display: 'inline', marginRight: '0.3rem' }} /> Teléfono / WhatsApp:
                </label>
                <input
                  type="text"
                  {...register('phone')}
                  placeholder="Ej. 77312345"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                  }}
                />
                {errors.phone && (
                  <span style={{ color: 'var(--color-danger)', fontSize: '0.78rem' }}>{errors.phone.message}</span>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Tipo de Usuario UAGRM:
              </label>
              <select
                {...register('userType')}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.88rem',
                }}
              >
                <option value="estudiante">Estudiante Regular UAGRM (Bs. 50/mes)</option>
                <option value="docente_admin">Administrativo o Docente UAGRM (Bs. 80/mes)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Disciplina Principal:
              </label>
              <select
                {...register('discipline')}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.88rem',
                }}
              >
                <option value="Gimnasio & Aparatos">Gimnasio & Aparatos (Musculación)</option>
                <option value="Boxeo">Boxeo Universitario</option>
                <option value="Kick Boxing">Kick Boxing</option>
                <option value="Baile & Zumba">Baile & Zumba Fitness</option>
                <option value="Entrenamiento Funcional">Entrenamiento Funcional</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.8rem', fontWeight: 800, borderRadius: '999px', marginTop: '0.4rem', cursor: 'pointer', background: 'var(--color-primary)' }}
            >
              Confirmar Inscripción y Generar QR
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle size={48} style={{ color: 'var(--color-success)', margin: '0 auto 1rem' }} />

            <div style={{ background: 'var(--color-secondary-dark)', color: '#fff', padding: '1.6rem', borderRadius: '18px', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 800 }}>CÓDIGO DE ACCESO TORNIQUETE UAGRM</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '0.12em', margin: '0.4rem 0', color: '#fff' }}>UAGRM-9942</div>
              <div style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>
                Socio: <strong>{confirmedData?.fullName}</strong> ({confirmedData?.userType === 'estudiante' ? 'Estudiante' : 'Docente/Admin'})<br />
                Reg. / CI: {confirmedData?.registroUagrm} • {confirmedData?.discipline}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '999px', fontWeight: 800, cursor: 'pointer' }}
            >
              Entendido / Cerrar
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BookingModal;
