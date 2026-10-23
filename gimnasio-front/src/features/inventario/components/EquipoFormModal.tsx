// src/features/inventario/components/EquipoFormModal.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaXmark, FaBoxesPacking, FaImage, FaTrashCan } from 'react-icons/fa6';
import { getEquipoImageUrl, type Equipo, type Ambiente, type Marca, type TipoEquipo } from '../services/inventarioService';

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
  onSubmit: (data: any) => void;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      estado: '1',
      id_ambiente: undefined,
      id_marca: undefined,
      id_tipo_equipo: undefined,
      fecha_adquisicion: '',
      precio_compra: undefined,
    },
  });

  useEffect(() => {
    setSelectedFile(null);
    if (equipoToEdit) {
      setImagePreview(equipoToEdit.imagen_url ? getEquipoImageUrl(equipoToEdit.imagen_url) : null);
      const isGood =
        equipoToEdit.estado === true ||
        ['1', 'true', 'bueno', 'operativo', 'en buen estado'].includes(
          String(equipoToEdit.estado ?? '').toLowerCase()
        );

      reset({
        codigo: equipoToEdit.codigo || '',
        nombre: equipoToEdit.nombre || '',
        modelo: equipoToEdit.modelo || '',
        cantidad: equipoToEdit.cantidad ?? 1,
        estado: isGood ? '1' : '0',
        id_ambiente: equipoToEdit.id_ambiente || undefined,
        id_marca: equipoToEdit.id_marca || undefined,
        id_tipo_equipo: equipoToEdit.id_tipo_equipo || undefined,
        fecha_adquisicion: equipoToEdit.fecha_adquisicion || '',
        precio_compra: equipoToEdit.precio_compra || undefined,
      });
    } else {
      setImagePreview(null);
      const randomCode = `EQ-${Math.floor(1000 + Math.random() * 9000)}`;
      reset({
        codigo: randomCode,
        nombre: '',
        modelo: '',
        cantidad: 1,
        estado: '1',
        id_ambiente: undefined,
        id_marca: undefined,
        id_tipo_equipo: undefined,
        fecha_adquisicion: new Date().toISOString().split('T')[0],
        precio_compra: undefined,
      });
    }
  }, [equipoToEdit, isOpen, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleFormSubmit = (data: EquipoFormData) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('codigo', data.codigo);
      formData.append('nombre', data.nombre);
      if (data.modelo) formData.append('modelo', data.modelo);
      formData.append('cantidad', String(data.cantidad));
      formData.append('estado', data.estado);
      if (data.id_ambiente) formData.append('id_ambiente', String(data.id_ambiente));
      if (data.id_marca) formData.append('id_marca', String(data.id_marca));
      if (data.id_tipo_equipo) formData.append('id_tipo_equipo', String(data.id_tipo_equipo));
      if (data.fecha_adquisicion) formData.append('fecha_adquisicion', data.fecha_adquisicion);
      if (data.precio_compra !== undefined && data.precio_compra !== null) {
        formData.append('precio_compra', String(data.precio_compra));
      }
      formData.append('imagen', selectedFile);
      onSubmit(formData);
    } else {
      onSubmit(data);
    }
  };

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
        <form onSubmit={handleSubmit(handleFormSubmit)} style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {/* Subida de Imagen */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
              Imagen del Equipo / Máquina
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem',
                border: '1px dashed #CBD5E1',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
              }}
            >
              {imagePreview ? (
                <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0', backgroundColor: '#FFF' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                    }}
                    title="Quitar Imagen"
                  >
                    <FaTrashCan />
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    backgroundColor: '#E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8',
                    fontSize: '1.8rem',
                  }}
                >
                  <FaImage />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  id="equipo-imagen-input"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="equipo-imagen-input"
                  style={{
                    display: 'inline-block',
                    padding: '0.45rem 0.9rem',
                    backgroundColor: '#003B70',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {imagePreview ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                </label>
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.75rem', color: '#64748B' }}>
                  Formatos permitidos: JPG, PNG, WEBP (Máx. 5MB)
                </p>
              </div>
            </div>
          </div>

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
