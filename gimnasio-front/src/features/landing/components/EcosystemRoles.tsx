// src/features/landing/components/EcosystemRoles.tsx
import React from 'react';
import { useUIStore } from '@/store/uiStore';
import { usePublicLanding } from '../hooks/usePublicLanding';
import { Users, ShieldCheck, UserCheck, Dumbbell, CheckCircle, QrCode, ClipboardList } from 'lucide-react';

const EcosystemRoles: React.FC = () => {
  const { activeRoleTab, setActiveRoleTab } = useUIStore();
  const { data } = usePublicLanding();
  const stats = data?.estadisticas;

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
        <div className="role-tabs reveal-up">
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
        <div className="role-content-wrapper surface-card reveal-up">
          {/* Role 1: Clientes UAGRM */}
          {activeRoleTab === 'socio' && (
            <div className="role-panel active">
              <div className="grid grid-2 align-center">
                <div className="reveal-left">
                  <span className="role-badge">Perfil 1 • Clientes Universitarios</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.6rem 0' }}>
                    Estudiantes, Administrativos y Docentes de la UAGRM
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.98rem' }}>
                    Los usuarios de la universidad acceden a tarifas preferenciales subvencionadas, se inscriben en las {stats ? stats.total_disciplinas_activas : ''} disciplinas activas y verifican la vigencia de su membresía en tiempo real.
                  </p>

                  <ul className="feature-list">
                    <li><CheckCircle size={18} /> <strong>Tarifas Diferenciadas:</strong> Precios especiales para estudiantes regulares y personal docente/administrativo.</li>
                    <li><CheckCircle size={18} /> <strong>Carnet Digital & QR:</strong> Presenta tu código QR en recepción para marcar asistencia rápida.</li>
                    <li><CheckCircle size={18} /> <strong>Gestión en Línea:</strong> Seguimiento de solicitudes, boletas de pago y planes de entrenamiento.</li>
                  </ul>
                </div>

                <div className="role-visual reveal-right">
                  <div className="surface-card" style={{ padding: '2.2rem', background: 'linear-gradient(145deg, #16161C 0%, #2C0909 100%)', color: '#fff', borderRadius: '24px', border: '1px solid rgba(220, 38, 38, 0.35)' }}>
                    <div style={{ fontSize: '0.78rem', color: '#F87171', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      PORTAL DEL SOCIO UAGRM
                    </div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Comunidad Universitaria D.U.B.S.</h4>
                    <p style={{ fontSize: '0.88rem', color: '#D4D4D8', marginBottom: '1.4rem' }}>
                      {stats ? `${stats.total_disciplinas_activas} disciplinas habilitadas hoy` : 'Gimnasio Universitario UAGRM'}
                    </p>
                    <div style={{ background: 'rgba(11, 11, 13, 0.65)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
                      <QrCode size={48} style={{ color: '#EF4444', margin: '0 auto 0.5rem' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>CARNET DIGITAL CON CÓDIGO QR</div>
                      <span style={{ fontSize: '0.8rem', color: '#A1A1AA' }}>Validación instantánea de boleta vigente</span>
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
                <div className="reveal-left">
                  <span className="role-badge" style={{ background: 'var(--color-primary)' }}>Perfil 2 • Administrador del Sistema</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.6rem 0' }}>
                    Control total y gestión de la plataforma D.U.B.S.
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.98rem' }}>
                    El Administrador maneja la totalidad del sistema: define precios de membresías, gestiona altas y bajas de instructores, recepcionistas, usuarios y supervisa los reportes estadísticos.
                  </p>

                  <ul className="feature-list">
                    <li><CheckCircle size={18} /> <strong>Gestión de Tarifas:</strong> Configuración de precios y planes vigentes en el sistema.</li>
                    <li><CheckCircle size={18} /> <strong>Control de Personal:</strong> Alta y asignación de credenciales para Recepcionistas e Instructores.</li>
                    <li><CheckCircle size={18} /> <strong>Reportes D.U.B.S.:</strong> Indicadores de aforo diario, ingresos y disciplinas más solicitadas.</li>
                  </ul>
                </div>

                <div className="role-visual reveal-right">
                  <div className="surface-card" style={{ padding: '2.2rem', background: '#181820', border: '2px solid #B91C1C' }}>
                    <div style={{ fontSize: '0.78rem', color: '#F87171', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      MÉTRICAS DEL SISTEMA EN VIVO
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>Estado Actual D.U.B.S. UAGRM</h4>
                    <div style={{ background: '#101015', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#D4D4D8' }}>
                        <span>Estudiantes Registrados Activos:</span>
                        <strong style={{ color: '#F87171' }}>{stats ? `${stats.estudiantes_activos} socios` : '—'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#D4D4D8' }}>
                        <span>Docentes / Administrativos Activos:</span>
                        <strong style={{ color: '#FFFFFF' }}>{stats ? `${stats.docentes_admin_activos} socios` : '—'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#D4D4D8' }}>
                        <span>Aforo Actual en Sede:</span>
                        <strong style={{ color: '#4ADE80' }}>
                          {stats ? `${stats.aforo_actual} / ${stats.cupo_maximo_total} cupos` : '—'}
                        </strong>
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
                <div className="reveal-left">
                  <span className="role-badge" style={{ background: '#272730', border: '1px solid rgba(255, 255, 255, 0.16)' }}>Perfil 3 • Recepcionista de Garita / Ingreso</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.6rem 0' }}>
                    Control de vigencia de membresías y torniquete de acceso
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.98rem' }}>
                    El Recepcionista es responsable de verificar en tiempo real la vigencia del pago de la membresía y registrar el control de entrada y salida de cada usuario en el gimnasio.
                  </p>

                  <ul className="feature-list">
                    <li><CheckCircle size={18} /> <strong>Validación de Vigencia:</strong> Verificación inmediata del estado de pago del alumno o docente.</li>
                    <li><CheckCircle size={18} /> <strong>Registro Entrada/Salida:</strong> Escaneo de QR en el ingreso y salida del gimnasio.</li>
                    <li><CheckCircle size={18} /> <strong>Emisión de Boletas:</strong> Aprobación de formularios y emisión de inscripción activa.</li>
                  </ul>
                </div>

                <div className="role-visual reveal-right">
                  <div className="surface-card" style={{ padding: '2.2rem', background: '#181820', border: '2px solid rgba(255, 255, 255, 0.18)' }}>
                    <div style={{ fontSize: '0.78rem', color: '#D4D4D8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      MÓDULO DE RECEPCIÓN & CONTROL DE ACCESO
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>Validación en Puerta de Ingreso</h4>
                    <div style={{ background: 'var(--color-success-bg)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--color-success)' }}>
                      <div style={{ color: 'var(--color-success-text)', fontWeight: 800, fontSize: '1rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={18} /> AFORO EN TIEMPO REAL
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                        Personas actualmente dentro: <strong>{stats ? stats.aforo_actual : 0}</strong><br />
                        Capacidad total habilitada: <strong>{stats ? stats.cupo_maximo_total : 0} cupos</strong>
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
                <div className="reveal-left">
                  <span className="role-badge" style={{ background: '#990000', color: '#FFFFFF' }}>Perfil 4 • Instructor / Coach Deportivo</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.6rem 0' }}>
                    Supervisión, recomendaciones e indicación de ejercicios
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.98rem' }}>
                    El equipo de {stats ? stats.instructores_activos : ''} instructores activos supervisa la postura en sala, guía los entrenamientos por disciplina y asigna planes personalizados.
                  </p>

                  <ul className="feature-list">
                    <li><CheckCircle size={18} /> <strong>Supervisión de Sala:</strong> Vela por el uso adecuado y seguro de los aparatos y pesas.</li>
                    <li><CheckCircle size={18} /> <strong>Asignación de Rutinas:</strong> Recomienda e indica ejercicios adaptados según el nivel del alumno.</li>
                    <li><CheckCircle size={18} /> <strong>Análisis & Nutrición IA:</strong> Apoyo con evaluación corporal y planes nutricionales.</li>
                  </ul>
                </div>

                <div className="role-visual reveal-right">
                  <div className="surface-card" style={{ padding: '2.2rem', background: '#181820', border: '2px solid rgba(220, 38, 38, 0.55)' }}>
                    <div style={{ fontSize: '0.78rem', color: '#F87171', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      EQUIPO DE INSTRUCTORES D.U.B.S.
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>
                      {stats ? `${stats.instructores_activos} Instructores Activos en Sistema` : 'Instructores D.U.B.S.'}
                    </h4>
                    <div style={{ background: '#101015', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <ClipboardList size={24} style={{ color: '#EF4444', marginBottom: '0.4rem' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Planes de Entrenamiento Personalizados</div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '0.3rem' }}>
                        Cobertura en {stats ? stats.total_disciplinas_activas : 0} disciplinas deportivas registradas en la sede central.
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
