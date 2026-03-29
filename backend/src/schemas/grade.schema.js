import { z } from 'zod';

export const createGradeSchema = z.object({
  studentId: z.string().uuid(),
  subjectId: z.string().uuid(),
  classId:   z.string().uuid(),
  score:     z.number().min(0).max(100),
  maxScore:  z.number().min(1).default(100),
  term:      z.enum(['Term 1', 'Term 2', 'Term 3']),
  examType:  z.enum(['Quiz', 'Midterm', 'Final', 'Assignment']),
  note:      z.string().optional(),
});

export const updateGradeSchema = createGradeSchema.partial();

export const gradeQuerySchema = z.object({
  studentId: z.string().uuid().optional(),
  classId:   z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  term:      z.string().optional(),
  page:      z.coerce.number().min(1).default(1),
  limit:     z.coerce.number().min(1).max(100).default(20),
});