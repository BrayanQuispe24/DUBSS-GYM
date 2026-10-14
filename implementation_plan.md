# Plan de Implementación: Restricción de Permisos en Gestión de Usuarios (Rol Recepcionista)

Este plan define la propuesta técnica para ajustar los permisos del rol **`recepcionista`** en el módulo de **Gestión de Usuarios**:
1. **Permiso de Visualización**: El usuario con rol `recepcionista` **podrá ver** el directorio de usuarios, aplicar filtros y consultar el expediente detallado del socio (`Ver Expediente Completo`).
2. **Restricción de Acciones Operativas**: El usuario con rol `recepcionista` **NO podrá**:
   - **Editar** datos de usuarios (botón de lápiz oculto y bloqueado).
   - **Suspender o reactivar** usuarios (botón de cambio de estado activo/suspendido oculto y bloqueado).
   - **Eliminar** usuarios (botón de papelera oculto y bloqueado).

---

## 1. Análisis del Estado Actual vs. Requerido

| Componente / Archivo | Estado Actual | Comportamiento Requerido |
| :--- | :--- | :--- |
| **Frontend: [UserTable.tsx](file:///c:/Users/brayan/Documents/Chamba/Taller%20de%20grado/DUBSS-GYM/gimnasio-front/src/features/users/components/UserTable.tsx)** | La prop `canManage` recibe `true` para recepcionista (`rol !== 'instructor'`), mostrando botones de Editar, Suspender/Reactivar y Eliminar. | Condicionar las acciones de modificación a `canManage={isAdmin}` (`user?.rol === 'administrador'`). Para recepcionista **únicamente se muestra el botón de ver detalle / expediente (`FaEye`)**. |
| **Frontend: [UserListPage.tsx](file:///c:/Users/brayan/Documents/Chamba/Taller%20de%20grado/DUBSS-GYM/gimnasio-front/src/features/users/pages/UserListPage.tsx)** | `canManage = currentUser?.rol !== 'instructor'`. Las funciones `handleOpenEdit`, `handleDelete` y `handleToggleStatus` permiten su ejecución a recepcionistas. | Separar permisos: `isAdmin = currentUser?.rol === 'administrador'`. Pasar `canManage={isAdmin}` a `UserTable`. Bloquear handlers de edición, eliminación y cambio de estado si no es `administrador`. |
| **Backend: [UsuarioPolicy.php](file:///c:/Users/brayan/Documents/Chamba/Taller%20de%20grado/DUBSS-GYM/gimnasio-back/app/Policies/UsuarioPolicy.php)** | `delete` y `updateEstado` ya exigen `Administrador`. `update` permite actualizar su propio perfil a otros roles. | Reforzar `update`, `delete` y `updateEstado` para garantizar que recepcionista reciba `403 Forbidden` ante cualquier intento de editar, suspender o eliminar a otros usuarios. |

---

## 2. Propuesta Técnica Detallada

### 2.1 Frontend (React - `gimnasio-front`)

1. **[UserListPage.tsx](file:///c:/Users/brayan/Documents/Chamba/Taller%20de%20grado/DUBSS-GYM/gimnasio-front/src/features/users/pages/UserListPage.tsx)**:
   - Declarar explícitamente:
     ```tsx
     const isAdmin = currentUser?.rol === 'administrador';
     ```
   - Proteger los métodos operativos:
     ```tsx
     const handleOpenEdit = (user: AuthUser) => {
       if (!isAdmin) return;
       setUserToEdit(user);
       setActiveTab('form');
     };

     const handleDelete = (id: number) => {
       if (!isAdmin) return;
       if (window.confirm('¿Está seguro de eliminar este usuario del sistema UAGRM?')) {
         deleteUser(id);
       }
     };

     const handleToggleStatus = (user: AuthUser) => {
       if (!isAdmin) return;
       toggleStatus({ id: user.id, currentStatus: user.estado });
     };
     ```
   - Pasar a la tabla:
     ```tsx
     <UserTable
       users={filteredUsers}
       isLoading={isLoading}
       canManage={isAdmin}
       onEdit={handleOpenEdit}
       onDelete={handleDelete}
       onToggleStatus={handleToggleStatus}
       onView={handleViewUser}
     />
     ```
   - **Registro de usuarios**: Determinar si la recepcionista conserva la pestaña `Registrar Nuevo Usuario` (para afiliar clientes nuevos en ventanilla) o si dicha pestaña también debe quedar restringida al Administrador (se solicita confirmación al usuario).

2. **[UserTable.tsx](file:///c:/Users/brayan/Documents/Chamba/Taller%20de%20grado/DUBSS-GYM/gimnasio-front/src/features/users/components/UserTable.tsx)**:
   - Mantener el botón `FaEye` ("Ver Expediente Completo") siempre visible para recepcionista y administrador.
   - Con `canManage={isAdmin}`, los botones `FaPenToSquare` (editar), `FaUserLock`/`FaUserCheck` (suspender/reactivar) y `FaTrashCan` (eliminar) quedarán completamente ocultos para la recepcionista.

---

### 2.2 Backend (Laravel - `gimnasio-back`)

1. **[UsuarioPolicy.php](file:///c:/Users/brayan/Documents/Chamba/Taller%20de%20grado/DUBSS-GYM/gimnasio-back/app/Policies/UsuarioPolicy.php)**:
   - Asegurar que `update` solo permita a Administrador (o al propio usuario en su sesión personal):
     ```php
     public function update(Usuario $authUser, Usuario $targetUser): bool
     {
         if (in_array(strtolower($authUser->rol?->nombre ?? ''), ['instructor', 'recepcionista'], true)) {
             return false;
         }

         return strcasecmp($authUser->rol?->nombre ?? '', 'Administrador') === 0;
     }

     public function delete(Usuario $authUser, Usuario $targetUser): bool
     {
         return strcasecmp($authUser->rol?->nombre ?? '', 'Administrador') === 0;
     }

     public function updateEstado(Usuario $authUser): bool
     {
         return strcasecmp($authUser->rol?->nombre ?? '', 'Administrador') === 0;
     }
     ```

---

## 3. Plan de Verificación

1. **Frontend (Visual y Tipos)**:
   - Ejecutar `cmd /c "npx.cmd tsc --noEmit --project tsconfig.app.json"` para validar ausencia de errores.
   - Iniciar sesión como `recepcionista`:
     - Acceder a `/dashboard/usuarios`.
     - Comprobar que en la columna "Acciones" de la tabla **únicamente aparece el botón azul/gris del ojo (`Ver Expediente Completo`)**.
     - Comprobar que no aparecen los botones de editar (lápiz), suspender (candado) ni eliminar (basurero).
   - Iniciar sesión como `administrador`:
     - Comprobar que los 4 botones de acción permanecen visibles y funcionales.
2. **Backend (Seguridad API)**:
   - Simular peticiones como recepcionista a:
     - `PUT /api/usuarios/{id}` -> Debe responder `403 Forbidden`.
     - `PATCH /api/usuarios/{id}/estado` -> Debe responder `403 Forbidden`.
     - `DELETE /api/usuarios/{id}` -> Debe responder `403 Forbidden`.
