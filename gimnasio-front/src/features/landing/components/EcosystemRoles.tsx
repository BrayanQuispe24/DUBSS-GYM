// src/features/landing/components/EcosystemRoles.tsx
import React from 'react';
import { useUIStore } from '@/store/uiStore';
import { Users, ShieldCheck, UserCheck, Dumbbell, CheckCircle, QrCode, ClipboardList } from 'lucide-react';

const EcosystemRoles: React.FC = () => {
  const { activeRoleTab, setActiveRoleTab } = useUIStore();

  return (
    <section className="section roles-section" id="roles">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <span className="section-subtitle">ROLES Y PERFILES DEL SISTEMA UAGRM</span>
          <h2 className="section-title">Diseñado para la gestión eficiente del gimnasio universitario</h2>
          <p className="section-description">
            El sistema de la Dirección Universitaria de Bienestar Social coordina 4 perfiles clave para garantizar el control, la seguridad y el rendimiento.
          </p>
        </div>

        {/* 4 Role Tabs */}
        <div className="role-tabs">
          <button
            className={`role-tab ${activeRoleTab === 'socio' ? 'active' : ''}`}
            onClick={() => setActiveRoleTab('socio')}
          >
            <Users size={18} />
            <span>1. Clientes (Estudiantes, Admin & Docentes)</span>
          </button>

          <button
            className={`role-tab ${activeRoleTab === 'gimnasio' ? 'active' : ''}`}
            onClick={() => setActiveRoleTab('gimnasio')}
          >
            <ShieldCheck size={18} />
            <span>2. Administrador del Sistema</span>
          </button>

          <button
            className={`role-tab ${activeRoleTab === 'entrenador' ? 'active' : ''}`}
            onClick={() => setActiveRoleTab('entrenador')}
          >
            <UserCheck size={18} />
            <span>3. Recepcionista (Vigencia & Entradas)</span>
          </button>

          <button
            className={`role-tab ${activeRoleTab === 'instructor' ? 'active' : ''}`}
            onClick={() => setActiveRoleTab('instructor')}
          >
            <Dumbbell size={18} />
            <span>4. Instructor (Supervisión & Rutinas)</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="role-content-wrapper surface-card">
          {/* Role 1: Clientes UAGRM */}
          {activeRoleTab === 'socio' && (
            <div className="role-panel active">
              <div className="grid grid-2 align-center">
                <div>
                  <span className="role-badge">Perfil 1 • Clientes Universitarios</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.6rem 0' }}>
                    Estudiantes, Administrativos y Docentes de la UAGRM
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.98rem' }}>
                    Los usuarios de la universidad acceden a tarifas preferenciales subvencionadas, se inscriben a disciplinas (Boxeo, Kick Boxing, Baile, Funcional, Musculación) y verifican su membresía activa.
                  </p>

                  <ul className="feature-list">
                    <li><CheckCircle size={18} /> <strong>Tarifas Diferenciadas:</strong> Precios especiales para estudiantes regulares y personal docente/administrativo.</li>
                    <li><CheckCircle size={18} /> <strong>Carnet Digital & QR:</strong> Presenta tu código QR en recepción para marcar asistencia rápida.</li>
                    <li><CheckCircle size={18} /> <strong>Inscripción Multi-disciplina:</strong> Acceso libre a las 5 áreas de entrenamiento del gimnasio.</li>
                  </ul>
                </div>

                <div className="role-visual">
                  <div className="surface-card" style={{ padding: '2.2rem', background: 'var(--color-secondary-dark)', color: '#fff', borderRadius: '24px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      PORTAL DEL SOCIO UAGRM
                    </div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Univ. Carlos Mendoza - Reg. 219084920</h4>
                    <p style={{ fontSize: '0.88rem', color: '#E2E8F0', marginBottom: '1.4rem' }}>Facultad de Ciencias de la Computación</p>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
                      <QrCode size={48} style={{ color: 'var(--color-accent)', margin: '0 auto 0.5rem' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>MEMBRESÍA ESTUDIANTE VIGENTE</div>
                      <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>Acceso habilitado a Musculación & Boxeo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Role 2: Administrador */}
          {activeRoleTab === 'gimnasio' && (
            <div className="role-panel active">
              <div className="grid grid-2 align-center">
                <div>
                  <span className="role-badge" style={{ background: 'var(--color-primary)' }}>Perfil 2 • Administrador del Sistema</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.6rem 0' }}>
                    Control total y gestión de la plataforma D.U.B.S.
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.98rem' }}>
                    El Administrador maneja la totalidad del sistema: define precios de membresías, gestiona altas y bajas de instructores, recepcionistas, usuarios y supervisa los reportes estadísticos.
                  </p>

                  <ul className="feature-list">
                    <li><CheckCircle size={18} /> <strong>Gestión de Tarifas:</strong> Configuración de precios para Membresía Estudiantil y Administrativos/Docentes.</li>
                    <li><CheckCircle size={18} /> <strong>Control de Personal:</strong> Alta y asignación de credenciales para Recepcionistas e Instructores.</li>
                    <li><CheckCircle size={18} /> <strong>Reportes D.U.B.S.:</strong> Indicadores de aforo diario, ingresos y disciplinas más solicitadas.</li>
                  </ul>
                </div>

                <div className="role-visual">
                  <div className="surface-card" style={{ padding: '2.2rem', border: '3px solid var(--color-primary)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      PANEL DE CONTROL ADMINISTRATIVO
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>Manejo del Sistema D.U.B.S. UAGRM</h4>
                    <div style={{ background: 'var(--color-background)', padding: '1.2rem', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                        <span>Total Estudiantes Activos:</span>
                        <strong style={{ color: 'var(--color-primary)' }}>1,420 socios</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                        <span>Docentes / Administrativos:</span>
                        <strong style={{ color: 'var(--color-secondary)' }}>380 socios</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Role 3: Recepcionista */}
          {activeRoleTab === 'entrenador' && (
            <div className="role-panel active">
              <div className="grid grid-2 align-center">
                <div>
                  <span className="role-badge" style={{ background: 'var(--color-secondary)' }}>Perfil 3 • Recepcionista de Garita / Ingreso</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.6rem 0' }}>
                    Control de vigencia de membresías y torniquete de acceso
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.98rem' }}>
                    El Recepcionista es responsable de verificar en tiempo real la vigencia del pago de la membresía y registrar el control de entrada y salida de cada usuario en el gimnasio.
                  </p>

                  <ul className="feature-list">
                    <li><CheckCircle size={18} /> <strong>Validación de Vigencia:</strong> Verificación inmediata del estado de pago del alumno o docente.</li>
                    <li><CheckCircle size={18} /> <strong>Registro Entrada/Salida:</strong> Escaneo de QR o número de Registro Universitario en el ingreso.</li>
                    <li><CheckCircle size={18} /> <strong>Cobro en Ventanilla:</strong> Renovación presencial de membresías mensuales o pases diarios.</li>
                  </ul>
                </div>

                <div className="role-visual">
                  <div className="surface-card" style={{ padding: '2.2rem', background: '#F8FAFC', border: '2px solid var(--color-secondary)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      MÓDULO DE RECEPCIÓN & CONTROL DE ACCESO
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>Validación en Puerta de Ingreso</h4>
                    <div style={{ background: 'var(--color-success-bg)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--color-success)' }}>
                      <div style={{ color: 'var(--color-success-text)', fontWeight: 800, fontSize: '1rem', marginBottom: '0.3rem' }}>
                        ✅ ACCESO PERMITIDO - MEMBRESÍA VIGENTE
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        Socio: Estudiante Gabriel Justiniano<br />
                        Disciplina: Boxeo & Aparatos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Role 4: Instructor */}
          {activeRoleTab === 'instructor' && (
            <div className="role-panel active">
              <div className="grid grid-2 align-center">
                <div>
                  <span className="role-badge" style={{ background: 'var(--color-accent)', color: '#000' }}>Perfil 4 • Instructor / Coach Deportivo</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.6rem 0' }}>
                    Supervisión, recomendaciones e indicación de ejercicios
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.98rem' }}>
                    El Instructor se encarga de supervisar la correcta postura en la sala de máquinas, guiar los entrenamientos de Boxeo, Kick Boxing, Baile y Funcional, y asignar recomendaciones de rutina a los usuarios.
                  </p>

                  <ul className="feature-list">
                    <li><CheckCircle size={18} /> <strong>Supervisión de Sala:</strong> Vela por el uso adecuado y seguro de los aparatos y pesas.</li>
                    <li><CheckCircle size={18} /> <strong>Asignación de Rutinas:</strong> Recomienda e indica ejercicios adaptados según el nivel del alumno.</li>
                    <li><CheckCircle size={18} /> <strong>Impartición de Clases:</strong> Dirige las sesiones grupales de Boxeo, Kick Boxing, Baile y Funcional.</li>
                  </ul>
                </div>

                <div className="role-visual">
                  <div className="surface-card" style={{ padding: '2.2rem', background: '#FFFDF5', border: '2px solid var(--color-accent)' }}>
                    <div style={{ fontSize: '0.78rem', color: '#996300', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      MÓDULO DE INSTRUCTORES D.U.B.S.
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>Coach Lic. Roberto Siles - Boxeo & Funcional</h4>
                    <div style={{ background: '#ffffff', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                      <ClipboardList size={24} style={{ color: 'var(--color-primary)', marginBottom: '0.4rem' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Recomendaciones de Ejercicio Asignadas</div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '0.3rem' }}>
                        Rutina sugerida: 4 series de Sentadillas en Rack + 3 series de Pecho en Banco Plano.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EcosystemRoles;
