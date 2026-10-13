// src/store/authStore.ts
import { create } from 'zustand';

export type UserRole = 'administrador' | 'recepcionista' | 'instructor' | 'cliente';

export interface AuthUser {
  id: number;
  name: string;
  nombre?: string;
  apellido?: string;
  email: string;
  rol: UserRole;
  registro_universitario?: string;
  ci?: string;
  telefono?: string;
  tipo_usuario?: 'estudiante' | 'docente' | 'administrativo' | 'particular';
  estado?: 'activo' | 'suspendido';
  id_disciplina?: number;
  disciplina?: { id: number; nombre: string };
}

export const normalizeUser = (rawUser: unknown): AuthUser | null => {
  if (!rawUser || typeof rawUser !== 'object') return null;

  const raw = rawUser as Record<string, unknown>;
  let roleName = '';

  if (typeof raw.rol === 'string') {
    roleName = raw.rol.toLowerCase();
  } else if (raw.rol && typeof raw.rol === 'object' && typeof (raw.rol as Record<string, unknown>).nombre === 'string') {
    roleName = String((raw.rol as Record<string, unknown>).nombre).toLowerCase();
  } else if (typeof raw.role_name === 'string') {
    roleName = raw.role_name.toLowerCase();
  } else {
    const idRol = Number(raw.id_rol || raw.rol_id || 0);
    if (idRol === 1) roleName = 'administrador';
    else if (idRol === 2) roleName = 'recepcionista';
    else if (idRol === 3) roleName = 'cliente';
    else if (idRol === 4) roleName = 'instructor';
  }

  const nombre = typeof raw.nombre === 'string' ? raw.nombre : '';
  const apellido = typeof raw.apellido === 'string' ? raw.apellido : '';
  const rawName = typeof raw.name === 'string' ? raw.name : '';

  const fullName = rawName || `${nombre} ${apellido}`.trim() || 'Usuario UAGRM';

  if (!roleName) {
    const emailStr = String(raw.email || '').toLowerCase();
    const nameStr = fullName.toLowerCase();
    if (emailStr.includes('admin') || nameStr.includes('admin')) {
      roleName = 'administrador';
    } else {
      roleName = 'cliente';
    }
  }

  let normalizedRole: UserRole = 'cliente';
  if (roleName.includes('admin')) normalizedRole = 'administrador';
  else if (roleName.includes('recep')) normalizedRole = 'recepcionista';
  else if (roleName.includes('instruct')) normalizedRole = 'instructor';

  let userEstado: 'activo' | 'suspendido' = 'activo';
  if (typeof raw.estado === 'boolean') {
    userEstado = raw.estado ? 'activo' : 'suspendido';
  } else if (typeof raw.estado === 'number') {
    userEstado = raw.estado === 1 ? 'activo' : 'suspendido';
  } else if (typeof raw.estado === 'string') {
    const estStr = raw.estado.toLowerCase();
    if (['suspendido', 'inactivo', 'false', '0'].includes(estStr)) {
      userEstado = 'suspendido';
    } else {
      userEstado = 'activo';
    }
  }

  const idDisciplina = raw.id_disciplina ? Number(raw.id_disciplina) : undefined;
  const disciplinaObj = raw.disciplina && typeof raw.disciplina === 'object' ? {
    id: Number((raw.disciplina as any).id),
    nombre: String((raw.disciplina as any).nombre || ''),
  } : undefined;

  return {
    id: typeof raw.id === 'number' ? raw.id : Number(raw.id || 0),
    name: fullName,
    nombre: nombre || rawName.split(' ')[0],
    apellido: apellido || rawName.split(' ').slice(1).join(' '),
    email: typeof raw.email === 'string' ? raw.email : '',
    rol: normalizedRole,
    registro_universitario: String(raw.registro_universitario || raw.codigo || ''),
    ci: String(raw.ci || ''),
    telefono: String(raw.telefono || raw.celular || ''),
    tipo_usuario: (raw.tipo_usuario as AuthUser['tipo_usuario']) || 'estudiante',
    estado: userEstado,
    id_disciplina: idDisciplina,
    disciplina: disciplinaObj,
  };
};

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (rawUser: unknown, token: string) => void;
  logout: () => void;
  setUser: (rawUser: unknown) => void;
}

const STORAGE_KEY_TOKEN = 'access_token';
const STORAGE_KEY_USER = 'auth_user';

const getInitialToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEY_TOKEN);
};

const getInitialUser = (): AuthUser | null => {
  const userJson = localStorage.getItem(STORAGE_KEY_USER);
  if (!userJson) return null;
  try {
    const parsed = JSON.parse(userJson);
    return normalizeUser(parsed);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: Boolean(getInitialToken()),

  login: (rawUser, token) => {
    const user = normalizeUser(rawUser);
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (rawUser) => {
    const user = normalizeUser(rawUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    set({ user });
  },
}));
