import React from 'react';
import { FaFilePdf, FaImage, FaXmark, FaDownload, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { resolveDocumentFileUrl, type Documento } from '../services/documentoService';

interface DocumentoPreviewModalProps {
  isOpen: boolean;
  documento: Documento | null;
  onClose: () => void;
}

const DocumentoPreviewModal: React.FC<DocumentoPreviewModalProps> = ({ isOpen, documento, onClose }) => {
  if (!isOpen || !documento) return null;

  const fileUrl = resolveDocumentFileUrl(documento);
  const docTitle = documento.titulo || documento.tipoDocumento?.nombre || documento.tipo_documento?.nombre || `Documento #${documento.id}`;
  const tipoNombre = documento.tipoDocumento?.nombre || documento.tipo_documento?.nombre || `Tipo ID: ${documento.id_tipo_documento}`;
  const rawPath = documento.archivo_url || documento.ruta_archivo || '';
  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(rawPath);
  const isPdf = !isImage;

  const userName = documento.usuario?.name || [documento.usuario?.nombre, documento.usuario?.apellido].filter(Boolean).join(' ') || documento.usuario?.email || `Usuario #${documento.id_usuario}`;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.5rem', width: '95%', maxWidth: '900px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)', maxHeight: '92vh', display: 'flex', flexDirection: 'column'
      }}>
        {/* MODAL HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              {isImage ? <FaImage style={{ color: '#0284C7' }} /> : <FaFilePdf style={{ color: '#EF4444' }} />}
              {docTitle}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Socio: <strong>{userName}</strong> — Tipo: <strong>{tipoNombre}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              title="Abrir en pestaña nueva"
              style={{ padding: '0.45rem 0.8rem', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#475569', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
            >
              <FaArrowUpRightFromSquare /> Pestaña Nueva
            </a>
            <a
              href={fileUrl}
              download
              title="Descargar Archivo"
              style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', backgroundColor: '#003B70', color: '#FFF', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
            >
              <FaDownload /> Descargar
            </a>
            <button
              onClick={onClose}
              style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
            >
              <FaXmark />
            </button>
          </div>
        </div>

        {/* FILE PREVIEW CANVAS */}
        <div style={{
          flex: 1, minHeight: '450px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.5rem'
        }}>
          {isImage ? (
            <img
              src={fileUrl}
              alt={documento.titulo}
              style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          ) : isPdf ? (
            <iframe
              src={fileUrl}
              title={documento.titulo}
              style={{ width: '100%', height: '72vh', border: 'none', borderRadius: '6px' }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
              <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>Vista previa no disponible para este tipo de archivo.</p>
              <a
                href={fileUrl}
                download
                style={{ color: '#003B70', fontWeight: 700, textDecoration: 'underline', fontSize: '0.88rem' }}
              >
                Haga clic aquí para descargar el archivo.
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentoPreviewModal;
