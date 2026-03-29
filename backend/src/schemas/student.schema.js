// src/schemas/student.schema.js
import { z } from 'zod';

export const createStudentSchema = z.object({
  firstName:   z.string().min(1, 'First name is required').max(50),
  lastName:    z.string().min(1, 'Last name is required').max(50),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  }),
  gender:      z.enum(['MALE', 'FEMALE']),
  classId:     z.string().uuid('Invalid class ID'),
  parentName:  z.string().min(1, 'Parent name is required'),
  parentPhone: z.string().min(8, 'Valid phone number required'),
  parentEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  address:     z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.partial();
// .partial() makes ALL fields optional — perfect for PATCH requests
// where the client only sends the fields they want to change

export const studentQuerySchema = z.object({
  page:    z.coerce.number().min(1).default(1),
  limit:   z.coerce.number().min(1).max(100).default(10),
  search:  z.string().optional(),
  classId: z.string().uuid().optional(),
  gender:  z.enum(['MALE', 'FEMALE']).optional(),
});
// z.coerce.number() converts the string "1" from query params
// into the number 1 automatically