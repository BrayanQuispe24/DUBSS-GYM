// src/features/dashboard/schemas/biFilters.schema.ts
import { z } from 'zod';

export const biGlobalFiltersSchema = z
  .object({
    desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inicial inválida'),
    hasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha final inválida'),
    id_disciplina: z.number().int().positive().nullable(),
    metodo_pago: z.string().max(50),
    estado_solicitud: z.enum(['', 'aprobado', 'pendiente', 'rechazado']),
    granularidad: z.enum(['day', 'month']),
  })
  .refine((data) => data.desde <= data.hasta, {
    message: 'La fecha inicial no puede ser mayor a la fecha final',
    path: ['hasta'],
  });

export type BiGlobalFiltersInput = z.infer<typeof biGlobalFiltersSchema>;

