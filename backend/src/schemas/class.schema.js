import { z } from 'zod';

export const createClassSchema = z.object({
  name:         z.string().min(1, 'Class name is required'),
  academicYear: z.string().regex(
    /^\d{4}-\d{4}$/,
    'Academic year must be in format YYYY-YYYY'
  ),
  capacity:     z.number().min(1).max(60).default(30),
  gradeLevelId: z.string().uuid('Invalid grade level ID'),
  teacherId:    z.string().uuid('Invalid teacher ID').optional(),
});

export const updateClassSchema = createClassSchema.partial();