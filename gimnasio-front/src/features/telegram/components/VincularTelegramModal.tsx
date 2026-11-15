// src/features/telegram/components/VincularTelegramModal.tsx
import React, { useEffect, useState } from 'react';
import {
  FaTelegram,
  FaCheck,
  FaCopy,
  FaArrowUpRightFromSquare,
  FaRotateRight,
  FaXmark,
  FaSpinner,
  FaTrashCan,
  FaShieldHalved,
} from 'react-icons/fa6';
import {
  useTelegramEstado,
  useSolicitarTelegramToken,
  useDesvincularTelegram,
} from '../hooks/useTelegram';
import type { TelegramTokenData } from '../services/telegramService';
import showToast from '@/utils/toast';

interface VincularTelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VincularTelegramModal: React.FC<VincularTelegramModalProps> = ({ isOpen, onClose }) => {
  const { data: estadoData, isLoading: loadingEstado, refetch: refetchEstado } = useTelegramEstado(isOpen);
  const solicitarTokenMutation = useSolicitarTelegramToken();
  const desvincularMutation = useDesvincularTelegram();

  const [tokenData, setTokenData] = useState<TelegramTokenData | null>(null);
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Solicitar token automáticamente si no está vinculado y aún no tiene token
  useEffect(() => {
    if (isOpen && estadoData && !estadoData.vinculado && !tokenData && !solicitarTokenMutation.isPending) {
      solicitarTokenMutation.mutate(undefined, {
        onSuccess: (res) => {
          setTokenData(res.data);
        },
      });
    }
  }, [isOpen, estadoData]);

  if (!isOpen) return null;

  const isVinculado = estadoData?.vinculado ?? false;

  const handleGenerarNuevoToken = () => {
    solicitarTokenMutation.mutate(undefined, {
      onSuccess: (res) => {
        setTokenData(res.data);
        showToast.info('Nuevo código de vinculación generado.', 'Telegram');
      },
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast.success('Código copiado al portapapeles', 'Telegram');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleVerificarVinculacion = async () => {
    setIsChecking(true);
    const res = await refetchEstado();
    setIsChecking(false);
    if (res.data?.vinculado) {
      showToast.success('¡Excelente! Tu cuenta de Telegram ha sido vinculada.', 'Vinculación Exitosa');
    } else {
      showToast.info('Aún no recibimos la confirmación de Telegram. Asegúrate de pulsar "Iniciar" en el bot.', 'Esperando');
    }
  };

  const handleDesvincular = () => {
    if (confirm('¿Estás seguro de que deseas desvincular tu cuenta de Telegram? Dejarás de recibir avisos automáticos de membresía.')) {
      desvincularMutation.mutate(undefined, {
        onSuccess: () => {
          setTokenData(null);
        },
      });
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface, #141419)',
        borderRadius: '4px',
        padding: '1.5rem 1.75rem',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--color-border-strong, #383846)',
        position: 'relative',
      }}>
        {/* MODAL HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--color-border, #272732)',
          paddingBottom: '0.75rem',
        }}>
          <div>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--color-text-primary, #F4F4F5)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}>
              <span style={{
                width: '32px', height: '32px', borderRadius: '4px',
                background: '#229ED9',
                color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
              }}>
                <FaTelegram />
              </span>
              Vinculación con Telegram
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #A1A1AA)', margin: '0.25rem 0 0 0' }}>
              Alertas de vencimiento de membresía y avisos directos a tu celular.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--color-surface-muted, #1A1A22)',
              border: '1px solid var(--color-border, #272732)',
              borderRadius: '4px',
              width: '30px',
              height: '30px',
              color: 'var(--color-text-muted, #A1A1AA)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              transition: 'all 0.15s ease',
            }}
          >
            <FaXmark />
          </button>
        </div>

        {/* LOADING STATE */}
        {loadingEstado && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-text-muted, #A1A1AA)' }}>
            <FaSpinner className="animate-spin" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'inline-block' }} />
            <div>Consultando estado de vinculación...</div>
          </div>
        )}

        {/* CASO 1: CUENTA YA VINCULADA */}
        {!loadingEstado && isVinculado && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              borderRadius: '4px',
              padding: '1.2rem',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '4px',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                color: '#4ADE80',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', flexShrink: 0,
              }}>
                <FaCheck />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#4ADE80', marginBottom: '0.2rem' }}>
                  ¡Cuenta Vinculada Activa!
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary, #D4D4D8)', margin: 0, lineHeight: 1.4 }}>
                  Tu Telegram está conectado correctamente. Recibirás avisos automáticos de vencimiento de tu membresía antes de que caduque.
                </p>
                {estadoData?.telegram_chat_id && (
                  <div style={{
                    marginTop: '0.65rem',
                    fontSize: '0.74rem',
                    color: 'var(--color-text-muted, #A1A1AA)',
                    fontFamily: 'monospace',
                  }}>
                    Chat ID: <span style={{ color: '#F4F4F5' }}>{estadoData.telegram_chat_id}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--color-border, #272732)',
              paddingTop: '1rem',
              marginTop: '0.5rem',
            }}>
              <button
                type="button"
                onClick={handleDesvincular}
                disabled={desvincularMutation.isPending}
                style={{
                  background: 'none',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  borderRadius: '4px',
                  padding: '0.5rem 0.85rem',
                  color: '#F87171',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: desvincularMutation.isPending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {desvincularMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaTrashCan />}
                Desvincular Telegram
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border-strong, #383846)',
                  backgroundColor: 'var(--color-surface-muted, #1A1A22)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* CASO 2: CUENTA NO VINCULADA (GENERACIÓN DE TOKEN Y GUÍA) */}
        {!loadingEstado && !isVinculado && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* TOKEN BOX */}
            <div style={{
              backgroundColor: 'var(--color-surface-muted, #1A1A22)',
              border: '1px solid var(--color-border-strong, #383846)',
              borderRadius: '4px',
              padding: '1rem 1.25rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted, #A1A1AA)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Código Temporal de Vinculación
              </div>

              {solicitarTokenMutation.isPending ? (
                <div style={{ padding: '0.75rem', color: 'var(--color-text-muted, #A1A1AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <FaSpinner className="animate-spin" /> Generando enlace seguro...
                </div>
              ) : tokenData ? (
                <div>
                  <div style={{
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    color: '#229ED9',
                    fontFamily: 'monospace',
                    marginBottom: '0.5rem',
                  }}>
                    {tokenData.token}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleCopy(tokenData.token)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border, #272732)',
                        backgroundColor: 'var(--color-surface, #141419)',
                        color: copied ? '#4ADE80' : 'var(--color-text-secondary, #D4D4D8)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      {copied ? <FaCheck /> : <FaCopy />}
                      {copied ? '¡Copiado!' : 'Copiar Código'}
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerarNuevoToken}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border, #272732)',
                        backgroundColor: 'var(--color-surface, #141419)',
                        color: 'var(--color-text-muted, #A1A1AA)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <FaRotateRight /> Nuevo Código
                    </button>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted, #A1A1AA)', marginTop: '0.5rem' }}>
                    Válido durante {tokenData.expires_in_minutes} minutos. Solo necesitas vincularlo una vez.
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerarNuevoToken}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid #229ED9',
                    backgroundColor: 'rgba(34, 158, 217, 0.1)',
                    color: '#229ED9',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Generar Código de Vinculación
                </button>
              )}
            </div>

            {/* BOTÓN PRINCIPAL: ABRIR EN TELEGRAM */}
            {tokenData?.deep_link && (
              <a
                href={tokenData.deep_link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '4px',
                  backgroundColor: '#229ED9',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(34, 158, 217, 0.35)',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <FaTelegram style={{ fontSize: '1.25rem' }} />
                Abrir en Telegram (@{tokenData.bot_username})
                <FaArrowUpRightFromSquare style={{ fontSize: '0.8rem' }} />
              </a>
            )}

            {/* PASOS GUIADOS */}
            <div style={{
              backgroundColor: 'var(--color-surface, #141419)',
              border: '1px solid var(--color-border, #272732)',
              borderRadius: '4px',
              padding: '0.85rem 1rem',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-secondary, #D4D4D8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Instrucciones Rápidas (3 Pasos):
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--color-text-muted, #A1A1AA)', lineHeight: 1.5 }}>
                <li>Haz clic en el botón azul superior <strong>"Abrir en Telegram"</strong>.</li>
                <li>En el chat con el bot, pulsa el botón <strong>"Iniciar"</strong> (o envía el mensaje preescrito).</li>
                <li>El bot te responderá confirmando que tu cuenta ha sido vinculada exitosamente.</li>
              </ol>
            </div>

            {/* FOOTER ACTIONS */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--color-border, #272732)',
              paddingTop: '0.85rem',
              marginTop: '0.25rem',
            }}>
              <button
                type="button"
                onClick={handleVerificarVinculacion}
                disabled={isChecking}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border-strong, #383846)',
                  backgroundColor: 'var(--color-surface-muted, #1A1A22)',
                  color: 'var(--color-text-primary, #F4F4F5)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: isChecking ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {isChecking ? <FaSpinner className="animate-spin" /> : <FaRotateRight />}
                Comprobar Vinculación
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border-strong, #383846)',
                  backgroundColor: 'var(--color-surface, #141419)',
                  color: 'var(--color-text-secondary, #D4D4D8)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VincularTelegramModal;

