import React from 'react';
import { FaFilePdf, FaFileImage, FaTrashCan, FaDownload, FaEye } from 'react-icons/fa6';
import { resolveDocumentFileUrl, type Documento } from '../services/documentoService';

interface DocumentoTableProps {
  documentos: Documento[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onPreview: (doc: Documento) => void;
}

const DocumentoTable: React.FC<DocumentoTableProps> = ({ documentos, isLoading, onDelete, onPreview }) => {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>Cargando documentos del repositorio...</div>;
  }

  if (documentos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B', backgroundColor: '#FFF', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}>
        No hay documentos subidos en el sistema.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #CBD5E1', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '0.65rem 0.85rem' }}>Documento</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Tipo</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Usuario / Socio</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Fecha Subida</th>
            <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((doc) => {
            const fileUrl = resolveDocumentFileUrl(doc);
            const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(doc.archivo_url || doc.ruta_archivo || '');
            const userName = doc.usuario?.name || [doc.usuario?.nombre, doc.usuario?.apellido].filter(Boolean).join(' ') || doc.usuario?.email || `Usuario #${doc.id_usuario}`;
            const docTitle = doc.titulo || doc.tipoDocumento?.nombre || doc.tipo_documento?.nombre || `Documento #${doc.id}`;
            const tipoNombre = doc.tipoDocumento?.nombre || doc.tipo_documento?.nombre || `Tipo ID: ${doc.id_tipo_documento}`;

            return (
              <tr key={doc.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0B1727' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isImage ? (
                      <FaFileImage style={{ color: '#0077D4', fontSize: '1rem' }} />
                    ) : (
                      <FaFilePdf style={{ color: '#DC2626', fontSize: '1rem' }} />
                    )}
                    <span>{docTitle}</span>
                  </div>
                </td>
                <td style={{ padding: '0.65rem 0.85rem' }}>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2px', fontSize: '0.70rem', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {tipoNombre}
                  </span>
                </td>
                <td style={{ padding: '0.65rem 0.85rem', color: '#475569' }}>
                  {userName}
                </td>
                <td style={{ padding: '0.65rem 0.85rem', color: '#64748B', fontSize: '0.75rem' }}>
                  {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Reciente'}
                </td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                    <button
                      onClick={() => onPreview(doc)}
                      title="Vista Previa del Documento / Imagen"
                      style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: '#F8FAFC', color: '#0077D4', border: '1px solid #CBD5E1', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      <FaEye />
                    </button>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: '#E0F2FE', color: '#0077D4', border: '1px solid #BAE6FD', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}
                      title="Descargar Archivo"
                    >
                      <FaDownload />
                    </a>
                    <button
                      onClick={() => onDelete(doc.id)}
                      title="Eliminar Documento"
                      style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentoTable;
