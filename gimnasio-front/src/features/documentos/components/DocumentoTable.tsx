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
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        No hay documentos subidos en el sistema.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1.25rem' }}>Documento</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Tipo</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Usuario / Socio</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Fecha Subida</th>
            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Acciones</th>
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
              <tr key={doc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0B1727' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {isImage ? (
                      <FaFileImage style={{ color: '#0284C7', fontSize: '1.2rem' }} />
                    ) : (
                      <FaFilePdf style={{ color: '#EF4444', fontSize: '1.2rem' }} />
                    )}
                    <span>{docTitle}</span>
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#334155' }}>
                    {tipoNombre}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1.25rem', color: '#475569' }}>
                  {userName}
                </td>
                <td style={{ padding: '0.85rem 1.25rem', color: '#64748B', fontSize: '0.8rem' }}>
                  {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Reciente'}
                </td>
                <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                    <button
                      onClick={() => onPreview(doc)}
                      title="Vista Previa del Documento / Imagen"
                      style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#F8FAFC', color: '#003B70', border: '1px solid #CBD5E1', cursor: 'pointer' }}
                    >
                      <FaEye />
                    </button>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Descargar Archivo"
                    >
                      <FaDownload />
                    </a>
                    <button
                      onClick={() => onDelete(doc.id)}
                      title="Eliminar Documento"
                      style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer' }}
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
