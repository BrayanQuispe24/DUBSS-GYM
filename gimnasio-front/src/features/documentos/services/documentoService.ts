// src/features/documentos/services/documentoService.ts
import api from '@/services/api';

export interface Documento {
  id: number;
  titulo?: string;
  ruta_archivo?: string;
  archivo_url?: string;
  id_tipo_documento: number;
  id_usuario: number;
  created_at?: string;
  tipoDocumento?: TipoDocumento;
  tipo_documento?: TipoDocumento;
  usuario?: {
    id: number;
    name?: string;
    nombre?: string;
    apellido?: string;
    codigo?: string;
    registro_universitario?: string;
    email: string;
  };
}

export interface TipoDocumento {
  id: number;
  nombre: string;
  descripcion?: string;
}

export const getDocumentos = async (): Promise<Documento[]> => {
  const response = await api.get('/documentos');
  return response.data.data;
};

export const getTipoDocumentos = async (): Promise<TipoDocumento[]> => {
  const response = await api.get('/tipo-documentos');
  return response.data.data;
};

export const uploadDocumento = async (formData: FormData): Promise<Documento> => {
  const response = await api.post('/documentos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const deleteDocumento = async (id: number): Promise<void> => {
  await api.delete(`/documentos/${id}`);
};

export const createTipoDocumento = async (data: { nombre: string; descripcion?: string }): Promise<TipoDocumento> => {
  const response = await api.post('/tipo-documentos', data);
  return response.data.data;
};

export const resolveDocumentFileUrl = (doc: Documento): string => {
  let urlPath = doc.archivo_url || doc.ruta_archivo || (doc as any).url || (doc as any).archivo || '';
  if (!urlPath) return '#';
  // Remover esquemas localhost para que siempre use rutas relativas en producción
  urlPath = urlPath.replace(/^https?:\/\/localhost(:\d+)?/i, '');
  if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
    return urlPath;
  }
  const cleanPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
  if (cleanPath.startsWith('/storage')) {
    return cleanPath;
  }
  return `/storage${cleanPath}`;
};
