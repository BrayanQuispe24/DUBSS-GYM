// src/features/historial/components/AntecedenteModal.tsx
import React, { useState, useEffect } from 'react';
import { FaHeartPulse, FaPlus } from 'react-icons/fa6';
import type { Historial } from '../services/historialService';
import { useCreateAntecedente } from '../hooks/useHistorial';

interface AntecedenteModalProps {
  isOpen: boolean;
  historial: Historial | null;
  onClose: () => void;
}

const AntecedenteModal: React.FC<AntecedenteModalProps> = ({ isOpen, historial, onClose }) => {
  const createAntecedenteMutation = useCreateAntecedente();

  const [tieneCardio, setTieneCardio] = useState(false);
  const [detCardio, setDetCardio] = useState('');

  const [tieneHipertension, setTieneHipertension] = useState(false);
  const [detHipertension, setDetHipertension] = useState('');

  const [tienePulmonar, setTienePulmonar] = useState(false);
  const [detPulmonar, setDetPulmonar] = useState('');

  const [tieneDiabetes, setTieneDiabetes] = useState(false);
  const [detDiabetes, setDetDiabetes] = useState('');

  const [tieneLesiones, setTieneLesiones] = useState(false);
  const [detLesiones, setDetLesiones] = useState('');

  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [detAlergias, setDetAlergias] = useState('');

  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    if (isOpen && historial) {
      const list = (historial as any).antecedentes || historial.antecedentes_medicos || [];
      if (Array.isArray(list) && list.length > 0) {
        const lastAnt = list[list.length - 1];
        setTieneCardio(Boolean(lastAnt.tiene_enfermedades_cardiovasculares));
        setDetCardio(lastAnt.detalle_enfermedades_cardiovasculares || '');

        setTieneHipertension(Boolean(lastAnt.tiene_hipertension_arterial));
        setDetHipertension(lastAnt.detalle_hipertension_arterial || '');

        setTienePulmonar(Boolean(lastAnt.tiene_enfermedades_pulmonares));
        setDetPulmonar(lastAnt.detalle_enfermedades_pulmonares || '');

        setTieneDiabetes(Boolean(lastAnt.tiene_diabetes));
        setDetDiabetes(lastAnt.detalle_diabetes || '');

        setTieneLesiones(Boolean(lastAnt.tiene_lesiones));
        setDetLesiones(lastAnt.detalle_lesiones || '');

        setTieneAlergias(Boolean(lastAnt.tiene_alergias));
        setDetAlergias(lastAnt.detalle_alergias || '');

        setObservaciones(lastAnt.observaciones || '');
      } else {
        setTieneCardio(false);
        setDetCardio('');
        setTieneHipertension(false);
        setDetHipertension('');
        setTienePulmonar(false);
        setDetPulmonar('');
        setTieneDiabetes(false);
        setDetDiabetes('');
        setTieneLesiones(false);
        setDetLesiones('');
        setTieneAlergias(false);
        setDetAlergias('');
        setObservaciones('');
      }
    }
  }, [isOpen, historial]);

  if (!isOpen || !historial) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createAntecedenteMutation.mutate(
      {
        id_historial: historial.id,
        tiene_enfermedades_cardiovasculares: tieneCardio,
        detalle_enfermedades_cardiovasculares: tieneCardio ? detCardio : undefined,
        tiene_hipertension_arterial: tieneHipertension,
        detalle_hipertension_arterial: tieneHipertension ? detHipertension : undefined,
        tiene_enfermedades_pulmonares: tienePulmonar,
        detalle_enfermedades_pulmonares: tienePulmonar ? detPulmonar : undefined,
        tiene_diabetes: tieneDiabetes,
        detalle_diabetes: tieneDiabetes ? detDiabetes : undefined,
        tiene_lesiones: tieneLesiones,
        detalle_lesiones: tieneLesiones ? detLesiones : undefined,
        tiene_alergias: tieneAlergias,
        detalle_alergias: tieneAlergias ? detAlergias : undefined,
        observaciones,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '600px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaHeartPulse style={{ color: '#DC2626' }} /> Registrar Antecedentes Médicos & Patologías
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Socio: <strong>{historial.usuario?.name || `ID: ${historial.id_usuario}`}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Cardiovascular */}
            <div style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem', color: '#0B1727', cursor: 'pointer' }}>
                <input type="checkbox" checked={tieneCardio} onChange={(e) => setTieneCardio(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#003B70' }} />
                Enfermedades Cardiovasculares
              </label>
              {tieneCardio && (
                <input
                  type="text"
                  placeholder="Especifique detalles o diagnóstico..."
                  value={detCardio}
                  onChange={(e) => setDetCardio(e.target.value)}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              )}
            </div>

            {/* Hipertensión */}
            <div style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem', color: '#0B1727', cursor: 'pointer' }}>
                <input type="checkbox" checked={tieneHipertension} onChange={(e) => setTieneHipertension(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#003B70' }} />
                Hipertensión Arterial
              </label>
              {tieneHipertension && (
                <input
                  type="text"
                  placeholder="Detalle medicamento o presión habitual..."
                  value={detHipertension}
                  onChange={(e) => setDetHipertension(e.target.value)}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              )}
            </div>

            {/* Pulmonar / Asma */}
            <div style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem', color: '#0B1727', cursor: 'pointer' }}>
                <input type="checkbox" checked={tienePulmonar} onChange={(e) => setTienePulmonar(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#003B70' }} />
                Enfermedades Pulmonares / Asma
              </label>
              {tienePulmonar && (
                <input
                  type="text"
                  placeholder="Especifique si usa inhalador o frecuencia..."
                  value={detPulmonar}
                  onChange={(e) => setDetPulmonar(e.target.value)}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              )}
            </div>

            {/* Diabetes */}
            <div style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem', color: '#0B1727', cursor: 'pointer' }}>
                <input type="checkbox" checked={tieneDiabetes} onChange={(e) => setTieneDiabetes(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#003B70' }} />
                Diabetes Mellitus
              </label>
              {tieneDiabetes && (
                <input
                  type="text"
                  placeholder="Tipo 1 o Tipo 2, uso de insulina..."
                  value={detDiabetes}
                  onChange={(e) => setDetDiabetes(e.target.value)}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              )}
            </div>

            {/* Lesiones */}
            <div style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem', color: '#0B1727', cursor: 'pointer' }}>
                <input type="checkbox" checked={tieneLesiones} onChange={(e) => setTieneLesiones(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#003B70' }} />
                Lesiones Osteoarticulares o Musculares
              </label>
              {tieneLesiones && (
                <input
                  type="text"
                  placeholder="Ej: Hernia discal, esguince de tobillo, cirugía de rodilla..."
                  value={detLesiones}
                  onChange={(e) => setDetLesiones(e.target.value)}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              )}
            </div>

            {/* Alergias */}
            <div style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem', color: '#0B1727', cursor: 'pointer' }}>
                <input type="checkbox" checked={tieneAlergias} onChange={(e) => setTieneAlergias(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#003B70' }} />
                Alergias Conocidas
              </label>
              {tieneAlergias && (
                <input
                  type="text"
                  placeholder="Medicamentos, alimentos, látex..."
                  value={detAlergias}
                  onChange={(e) => setDetAlergias(e.target.value)}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Observaciones Adicionales / Indicaciones
              </label>
              <textarea
                rows={2}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Cualquier indicación adicional para los entrenadores..."
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.55rem 1.1rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createAntecedenteMutation.isPending}
              style={{ padding: '0.55rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#003B70', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
            >
              {createAntecedenteMutation.isPending ? 'Guardando...' : 'Guardar Antecedentes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AntecedenteModal;
