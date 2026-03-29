import { z } from 'zod';

// Mark attendance for multiple students at once
export const markAttendanceSchema = z.object({
  classId: z.string().uuid(),
  date:    z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date'
  }),
  records: z.array(z.object({
    studentId: z.string().uuid(),
    status:    z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    note:      z.string().optional(),
  })).min(1, 'At least one attendance record required'),
});

export const attendanceQuerySchema = z.object({
  classId:   z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  date:      z.string().optional(),
  startDate: z.string().optional(),
  endDate:   z.string().optional(),
  page:      z.coerce.number().min(1).default(1),
  limit:     z.coerce.number().min(1).max(100).default(30),
});