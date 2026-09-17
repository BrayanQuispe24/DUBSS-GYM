---
name: react-frontend-architecture
description: Reglas, convenciones y arquitectura estricta de carpetas para el desarrollo del frontend en React (Vite, TanStack Query, Zustand, Axios, React Router DOM, React Hook Form, Zod). Utilizar siempre que se genere, modifique o audite código del frontend.
---

# Arquitectura Estricta para Frontend React

Esta habilidad define los estándares obligatorios de arquitectura, organización de código, flujo de datos y convenciones de diseño para el frontend React de la aplicación de pentesting y auditoría.

---

## 1. Estratos de la Arquitectura de Carpetas

Todo el código generado dentro de `src/` debe seguir de forma estricta la siguiente estructura:

```text
src/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── components/
│   ├── ui/
│   └── common/
├── layouts/
│   ├── MainLayout.jsx
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
├── pages/
├── features/
│   ├── auth/
│   ├── users/
│   ├── organizations/
│   ├── pentesters/
│   ├── auditors/
│   ├── projects/
│   ├── targets/
│   ├── scans/
│   ├── vulnerabilities/
│   ├── reports/
│   └── dashboard/
├── services/
│   ├── api.js
│   └── endpoints.js
├── hooks/
├── context/
├── store/
├── routes/
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── utils/
├── styles/
├── App.jsx
└── main.jsx
```

---

## 2. Arquitectura Basada en Features (`src/features/`)

Cada módulo en `src/features/` debe ser autónomo e independiente. Ninguna feature debe importar archivos internos privados de otra feature.

Estructura tipo por feature:

```text
features/{feature}/
├── components/
│   ├── {Feature}Card.jsx
│   ├── {Feature}Form.jsx
│   └── {Feature}Table.jsx
├── pages/
│   ├── {Feature}ListPage.jsx
│   ├── {Feature}DetailPage.jsx
│   └── {Feature}CreatePage.jsx
├── hooks/
│   └── use{Feature}.js
├── services/
│   └── {feature}Service.js
├── store/
│   └── {feature}Store.js
└── utils/
    └── {feature}Helpers.js
```

---

## 3. Desglose de Componentes

### `src/components/ui/`
* Componentes puramente visuales y genéricos (sin lógica de negocio ni llamadas a API):
  * `Button.jsx`, `Input.jsx`, `Select.jsx`, `Textarea.jsx`, `Modal.jsx`, `Badge.jsx`, `Card.jsx`, `Table.jsx`, `Dropdown.jsx`, `Tabs.jsx`, `Tooltip.jsx`, `Pagination.jsx`.

### `src/components/common/`
* Componentes reutilizables globales a nivel de UI de aplicación:
  * `Loader.jsx`, `ErrorMessage.jsx`, `EmptyState.jsx`, `ConfirmDialog.jsx`, `PageHeader.jsx`, `SearchBar.jsx`.

---

## 4. Gestión de Estado: TanStack Query vs Zustand

* **TanStack Query (v5):** Maneja **TODO el estado del servidor** (peticiones HTTP, caché, loading, errores, mutaciones e invalidación de consultas).
* **Zustand:** Maneja únicamente el **estado global del cliente** (usuario autenticado, token, tema visual, estado del sidebar, filtros globales de interfaz).
* **PROHIBIDO:** Duplicar datos obtenidos de la API dentro de Zustand.

---

## 5. Capa de Servicios y Axios (`src/services/api.js`)

* Instancia de Axios configurada únicamente en `src/services/api.js`:
  ```javascript
  import axios from 'axios';

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  export default api;
  ```
* Cada feature define su servicio en `features/{feature}/services/{feature}Service.js` consumiendo el cliente central `api`:
  ```javascript
  import api from '@/services/api';

  export const getVulnerabilities = async (params) => {
    const response = await api.get('/vulnerabilities', { params });
    return response.data;
  };
  ```

---

## 6. Custom Hooks con TanStack Query (`features/{feature}/hooks/`)

Toda petición HTTP para vistas debe estar encapsulada en custom hooks dentro del módulo:

```javascript
// src/features/vulnerabilities/hooks/useVulnerabilities.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVulnerabilities, createVulnerability } from '../services/vulnerabilityService';

export const useVulnerabilities = (filters) => {
  return useQuery({
    queryKey: ['vulnerabilities', filters],
    queryFn: () => getVulnerabilities(filters),
  });
};

export const useCreateVulnerability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVulnerability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vulnerabilities'] });
    },
  });
};
```

---

## 7. Formularios y Validación (React Hook Form + Zod)

Los formularios dentro de `features/{feature}/components/` deben construirse utilizando **React Hook Form** junto a esquemas de **Zod**:

```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const vulnerabilitySchema = z.object({
  title: z.string().min(3, 'El título es obligatorio'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
});
```

---

## 8. Convenciones de Nomenclatura e Importación

* **Componentes:** `PascalCase.jsx` (ej. `VulnerabilityCard.jsx`).
* **Hooks:** `useCamelCase.js` (ej. `useVulnerabilities.js`).
* **Servicios:** `camelCaseService.js` (ej. `vulnerabilityService.js`).
* **Stores Zustand:** `nombreStore.js` (ej. `authStore.js`).
* **Alias de importación:** Usar siempre `@/` para hacer referencia a `src/`.
  ```javascript
  import Button from '@/components/ui/Button';
  import { useAuthStore } from '@/features/auth/store/authStore';
  ```

---

## 9. Lo Que NO Se Debe Hacer (Anti-Patrones Frontend)

* ❌ **NO** hacer llamadas de Axios o `fetch` directamente dentro de componentes React.
* ❌ **NO** escribir URLs absolutas (`http://localhost:8000/api/...`) dentro de componentes o servicios. Usar `api.js` y variables de entorno.
* ❌ **NO** almacenar datos obtenidos de la API en Zustand.
* ❌ **NO** crear componentes gigantes. Dividir en subcomponentes por responsabilidad.
* ❌ **NO** colocar componentes o lógica específica de un módulo dentro de `src/components/common/` o `src/components/ui/`.
* ❌ **NO** repetir layout (Sidebar, Header) en cada página; usar `src/layouts/`.

---

## 10. Formato de Respuesta Obligatorio al Generar Código

Cada vez que se solicite implementar una funcionalidad del frontend, la respuesta DEBE:

1. **Mostrar primero el árbol de archivos** a crear o modificar:
   ```text
   src/
   └── features/
       └── vulnerabilities/
           ├── components/
           │   └── VulnerabilityCard.jsx
           ├── hooks/
           │   └── useVulnerabilities.js
           ├── services/
           │   └── vulnerabilityService.js
           └── pages/
               └── VulnerabilityListPage.jsx
   ```

2. **Generar el código archivo por archivo**, indicando siempre la ruta en la primera línea:
   ```javascript
   // src/features/vulnerabilities/services/vulnerabilityService.js
   import api from '@/services/api';
   ...
   ```
