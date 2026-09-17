// src/features/calculator/components/GymRevenueCalculator.tsx
import React, { useState } from 'react';
import { GraduationCap, Briefcase, Calculator, CheckCircle2 } from 'lucide-react';
import { useBookingStore } from '@/features/booking/store/bookingStore';

const GymRevenueCalculator: React.FC = () => {
  const [students, setStudents] = useState<number>(400);
  const [docents, setDocents] = useState<number>(100);

  const studentPrice = 50; // Bs. 50/mes
  const docentPrice = 80;   // Bs. 80/mes

  const { openModal } = useBookingStore();

  const totalStudentsTotal = students * studentPrice;
  const totalDocentsTotal = docents * docentPrice;
  const grandTotalMonthly = totalStudentsTotal + totalDocentsTotal;
  const totalUsers = students + docents;

  return (
    <section className="section calculator-section" id="calculadora">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <span className="section-subtitle">SIMULADOR DE MEMBRESÍAS UAGRM</span>
          <h2 className="section-title">Estima el presupuesto y aforo del Gimnasio Universitario</h2>
          <p className="section-description">
            Calcula los ingresos mensuales proyectados por cobro de membresías a Estudiantes y Administrativos/Docentes de la universidad.
          </p>
        </div>

        <div className="calculator-card grid grid-2">
          {/* Controls */}
          <div className="calc-inputs">
            <div className="calc-group">
              <div className="calc-label-row">
                <label htmlFor="range-students" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <GraduationCap size={18} style={{ color: 'var(--color-primary)' }} /> Estudiantes Inscritos (Bs. 50/mes):
                </label>
                <span className="calc-val" id="val-students">{students} alumnos</span>
              </div>
              <input
                type="range"
                id="range-students"
                min="50"
                max="2000"
                step="50"
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
              />
            </div>

            <div className="calc-group">
              <div className="calc-label-row">
                <label htmlFor="range-docents" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Briefcase size={18} style={{ color: 'var(--color-secondary)' }} /> Administrativos & Docentes (Bs. 80/mes):
                </label>
                <span className="calc-val" id="val-docents" style={{ color: 'var(--color-secondary)' }}>{docents} personal</span>
              </div>
              <input
                type="range"
                id="range-docents"
                min="10"
                max="500"
                step="10"
                value={docents}
                onChange={(e) => setDocents(Number(e.target.value))}
              />
            </div>

            <div style={{ background: 'var(--color-background)', padding: '1.2rem', borderRadius: '14px', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calculator size={16} /> Resumen de Capacidad Activa D.U.B.S.:
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div>• Total Socios Activos: <strong>{totalUsers} personas</strong></div>
                <div>• Cobertura Disciplinas: Boxeo, Kick Boxing, Baile, Funcional, Aparatos.</div>
                <div>• Supervisión: 4 Instructores por Turno.</div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="calc-result-card surface-card reveal-right" style={{ background: 'linear-gradient(145deg, #001C38 0%, #003B70 50%, #990000 100%)' }}>
            <span className="calc-result-title">Recaudación Proyectada por Membresías</span>
            <div className="calc-amount-primary">
              <span className="currency" style={{ fontSize: '1.8rem', marginRight: '0.3rem' }}>Bs.</span>
              <span id="calc-net-monthly">{grandTotalMonthly.toLocaleString('es-BO')}</span>
            </div>
            <p className="calc-sub-note">Fondo destinado al mantenimiento de equipamiento y pago de instructores UAGRM</p>

            <div className="calc-breakdown">
              <div className="breakdown-item">
                <span>Ingreso Membresías Estudiantes (Bs. 50):</span>
                <strong>Bs. {totalStudentsTotal.toLocaleString('es-BO')}</strong>
              </div>
              <div className="breakdown-item">
                <span>Ingreso Admin/Docentes (Bs. 80):</span>
                <strong>Bs. {totalDocentsTotal.toLocaleString('es-BO')}</strong>
              </div>
              <div className="breakdown-item highlight">
                <span>Proyección Anual D.U.B.S.:</span>
                <strong>Bs. {(grandTotalMonthly * 12).toLocaleString('es-BO')}</strong>
              </div>
            </div>

            <button
              className="btn btn-accent btn-block btn-calc-cta"
              id="btn-calc-apply"
              onClick={() => openModal('Membresía Estudiantes UAGRM', 'Bs. 50 / mes', 'Gimnasio Universitario DUBS')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              <CheckCircle2 size={18} /> Inscribirme Ahora a una Membresía
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GymRevenueCalculator;
