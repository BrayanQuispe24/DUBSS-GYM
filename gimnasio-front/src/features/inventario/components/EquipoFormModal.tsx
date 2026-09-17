// src/features/inventario/components/EquipoFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaXmark, FaBoxesPacking } from 'react-icons/fa6';
import type { Equipo, Ambiente, Marca, TipoEquipo } from '../services/inventarioService';

const equipoSchema = z.object({
  codigo: z.string().min(2, 'El código es obligatorio'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  modelo: z.string().optional(),
  cantidad: z.coerce.number().min(0, 'La cantidad no puede ser negativa'),
  estado: z.string().min(1, 'Seleccione un estado'),
  id_ambiente: z.coerce.number().nullable().optional(),
  id_marca: z.coerce.number().nullable().optional(),
  id_tipo_equipo: z.coerce.number().nullable().optional(),
  fecha_adquisicion: z.string().optional(),
  precio_compra: z.coerce.number().optional(),
});

type EquipoFormData = z.infer<typeof equipoSchema>;

interface EquipoFormModalProps {
  isOpen: boolean;
  equipoToEdit: Equipo | null;
  ambientes: Ambiente[];
  marcas: Marca[];
  tipoEquipos: TipoEquipo[];
  onClose: () => void;
  onSubmit: (data: EquipoFormData) => void;
  isPending: boolean;
}

const EquipoFormModal: React.FC<EquipoFormModalProps> = ({
  isOpen,
  equipoToEdit,
  ambientes,
  marcas,
  tipoEquipos,
  onClose,
  onSubmit,
  isPending,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EquipoFormData>({
    resolver: zodResolver(equipoSchema),
    defaultValues: {
      codigo: '',
      nombre: '',
      modelo: '',
      cantidad: 1,
      estado: 'bueno',
      id_ambiente: undefined,
      id_marca: undefined,
      id_tipo_equipo: undefined,
      fecha_adquisicion: '',
      precio_compra: undefined,
    },
  });

  useEffect(() => {
    if (equipoToEdit) {
      reset({
        codigo: equipoToEdit.codigo || '',
        nombre: equipoToEdit.nombre || '',
        modelo: equipoToEdit.modelo || '',
        cantidad: equipoToEdit.cantidad ?? 1,
        estado: String(equipoToEdit.estado || 'bueno'),
        id_ambiente: equipoToEdit.id_ambiente || undefined,
        id_marca: equipoToEdit.id_marca || undefined,
        id_tipo_equipo: equipoToEdit.id_tipo_equipo || undefined,
        fecha_adquisicion: equipoToEdit.fecha_adquisicion || '',
        precio_compra: equipoToEdit.precio_compra || undefined,
      });
    } else {
      // Auto-generate a default unique code prefix if creating new
      const randomCode = `EQ-${Math.floor(1000 + Math.random() * 9000)}`;
      reset({
        codigo: randomCode,
        nombre: '',
        modelo: '',
        cantidad: 1,
        estado: 'bueno',
        id_ambiente: undefined,
        id_marca: undefined,
        id_tipo_equipo: undefined,
        fecha_adquisicion: new Date().toISOString().split('T')[0],
        precio_compra: undefined,
      });
    }
  }, [equipoToEdit, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(11, 23, 39, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FaBoxesPacking style={{ color: '#003B70', fontSize: '1.1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
              {equipoToEdit ? 'Editar Equipo / Máquina' : 'Registrar Nuevo Equipo'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.2rem',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FaXmark />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '1.5rem', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.2rem' }}>
            {/* Código */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Código Patrimonial <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: EQ-1001"
                {...register('codigo')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: errors.codigo ? '1px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.codigo && (
                <span style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: '0.2rem', display: 'block' }}>
                  {errors.codigo.message}
                </span>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Nombre del Equipo / Máquina <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Cinta de Correr Profesional, Mancuernas 10kg"
                {...register('nombre')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: errors.nombre ? '1px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.nombre && (
                <span style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: '0.2rem', display: 'block' }}>
                  {errors.nombre.message}
                </span>
              )}
            </div>

            {/* Modelo */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Modelo / Referencia
              </label>
              <input
                type="text"
                placeholder="Ej: T600 Pro Series"
                {...register('modelo')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Cantidad / Stock */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Cantidad en Stock <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="1"
                {...register('cantidad')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: errors.cantidad ? '1px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.cantidad && (
                <span style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: '0.2rem', display: 'block' }}>
                  {errors.cantidad.message}
                </span>
              )}
            </div>

            {/* Estado */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Estado Técnico <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                {...register('estado')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: errors.estado ? '1px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="bueno">Bueno (Operativo)</option>
                <option value="regular">Regular (Requiere Revisión)</option>
                <option value="mantenimiento">En Mantenimiento</option>
                <option value="baja">Dado de Baja</option>
              </select>
            </div>

            {/* Ambiente / Sala */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Ambiente / Ubicación
              </label>
              <select
                {...register('id_ambiente')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">-- Seleccionar Ambiente --</option>
                {ambientes.map((amb) => (
                  <option key={amb.id} value={amb.id}>
                    {amb.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Marca */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Marca
              </label>
              <select
                {...register('id_marca')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">-- Seleccionar Marca --</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Equipo */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Tipo de Equipo / Categoría
              </label>
              <select
                {...register('id_tipo_equipo')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">-- Seleccionar Categoría --</option>
                {tipoEquipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha Adquisición */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Fecha de Adquisición
              </label>
              <input
                type="date"
                {...register('fecha_adquisicion')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Precio de Compra */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Precio de Compra (Bs.)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('precio_compra')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#003B70',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,59,112,0.2)',
              }}
            >
              {isPending ? 'Guardando...' : equipoToEdit ? 'Actualizar Equipo' : 'Registrar Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipoFormModal;
