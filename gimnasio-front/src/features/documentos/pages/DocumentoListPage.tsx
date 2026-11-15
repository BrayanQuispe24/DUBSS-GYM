// src/features/documentos/pages/DocumentoListPage.tsx
import React, { useState } from 'react';
import { FaFolderOpen, FaCloudArrowUp, FaTag, FaMagnifyingGlass } from 'react-icons/fa6';
import { useDocumentos, useTipoDocumentos, useUploadDocumento, useDeleteDocumento } from '../hooks/useDocumentos';
import { useUsers } from '@/features/users/hooks/useUsers';
import type { Documento } from '../services/documentoService';
import DocumentoTable from '../components/DocumentoTable';
import DocumentoUploadModal from '../components/DocumentoUploadModal';
import TipoDocumentoModal from '../components/TipoDocumentoModal';
import DocumentoPreviewModal from '../components/DocumentoPreviewModal';

import { useAuthStore } from '@/store/authStore';

const DocumentoListPage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const isAdminOrStaff = currentUser?.rol === 'administrador' || currentUser?.rol === 'recepcionista';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTipoModalOpen, setIsTipoModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [selectedDocForPreview, setSelectedDocForPreview] = useState<Documento | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipoId, setSelectedTipoId] = useState('');

  const { data: documentos = [], isLoading } = useDocumentos();
  const { data: tipos = [] } = useTipoDocumentos();
  const { data: users = [] } = useUsers();

  const uploadMutation = useUploadDocumento();
  const deleteMutation = useDeleteDocumento();

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este documento digital?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenPreview = (doc: Documento) => {
    setSelectedDocForPreview(doc);
    setIsPreviewModalOpen(true);
  };

  const handleUploadSubmit = (formData: FormData) => {
    uploadMutation.mutate(formData, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const filteredDocumentos = documentos.filter((doc) => {
    // Si no es admin ni recepcionista, solo mostrar sus propios documentos
    if (!isAdminOrStaff && doc.id_usuario !== currentUser?.id) {
      return false;
    }

    const matchesTipo = selectedTipoId ? String(doc.id_tipo_documento) === String(selectedTipoId) : true;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesTipo;

    const userName = (doc.usuario?.name || [doc.usuario?.nombre, doc.usuario?.apellido].filter(Boolean).join(' ') || '').toLowerCase();
    const userEmail = (doc.usuario?.email || '').toLowerCase();
    const userRu = (doc.usuario?.registro_universitario || doc.usuario?.codigo || '').toLowerCase();
    const docTitle = (doc.titulo || '').toLowerCase();
    const docTipoName = (doc.tipoDocumento?.nombre || '').toLowerCase();

    const matchesSearch =
      userName.includes(query) ||
      userEmail.includes(query) ||
      userRu.includes(query) ||
      docTitle.includes(query) ||
      docTipoName.includes(query);

    return matchesTipo && matchesSearch;
  });

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaFolderOpen style={{ color: 'var(--color-primary-text)' }} /> Repositorio de Documentación Digital
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Carga, filtro, vista previa y consulta de carnets, certificados médicos y respaldos institucionales.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {currentUser?.rol === 'administrador' && (
            <button
              onClick={() => setIsTipoModalOpen(true)}
              style={{
                padding: '0.55rem 1rem', borderRadius: '4px',
                backgroundColor: 'var(--color-surface)', color: 'var(--color-primary-text)', border: '1px solid var(--color-border-strong)', fontWeight: 700, fontSize: '0.80rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em'
              }}
            >
              <FaTag /> Tipos de Documento
            </button>
          )}
          {currentUser?.rol === 'cliente' && (
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: '0.55rem 1rem', borderRadius: '4px',
                background: 'var(--color-primary)',
                color: '#FFFFFF', border: '1px solid var(--color-primary)', fontWeight: 700, fontSize: '0.80rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em'
              }}
            >
              <FaCloudArrowUp /> Subir Documento
            </button>
          )}
        </div>
      </div>

      {/* BARRA DE FILTRADO POR USUARIO Y TIPO */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <FaMagnifyingGlass style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }} />
          <input
            type="text"
            placeholder="Filtrar por Socio (Nombre, R.U., Email) o Título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '0.55rem 0.85rem 0.55rem 2.25rem', borderRadius: '4px',
              border: '1px solid var(--color-border-strong, #383846)', backgroundColor: 'var(--color-surface, #141419)',
              color: 'var(--color-text-primary, #F4F4F5)', fontSize: '0.82rem', outline: 'none',
            }}
          />
        </div>
        <div style={{ width: '220px' }}>
          <select
            value={selectedTipoId}
            onChange={(e) => setSelectedTipoId(e.target.value)}
            style={{
              width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px',
              border: '1px solid var(--color-border-strong, #383846)', backgroundColor: 'var(--color-surface, #141419)',
              color: 'var(--color-text-primary, #F4F4F5)', colorScheme: 'dark', fontSize: '0.82rem', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="" style={{ backgroundColor: '#141419', color: '#F4F4F5' }}>Todos los Tipos</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id} style={{ backgroundColor: '#141419', color: '#F4F4F5' }}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DocumentoTable
        documentos={filteredDocumentos}
        isLoading={isLoading}
        onDelete={handleDelete}
        onPreview={handleOpenPreview}
      />

      <DocumentoUploadModal
        isOpen={isModalOpen}
        tipos={tipos}
        users={users}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUploadSubmit}
        isPending={uploadMutation.isPending}
        onOpenTipoModal={() => {
          setIsModalOpen(false);
          setIsTipoModalOpen(true);
        }}
      />

      <TipoDocumentoModal
        isOpen={isTipoModalOpen}
        tipos={tipos}
        onClose={() => setIsTipoModalOpen(false)}
      />

      <DocumentoPreviewModal
        isOpen={isPreviewModalOpen}
        documento={selectedDocForPreview}
        onClose={() => setIsPreviewModalOpen(false)}
      />
    </section>
  );
};

export default DocumentoListPage;
