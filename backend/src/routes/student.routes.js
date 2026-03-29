// src/routes/student.routes.js
import { Router } from 'express';
import {
  getStudents, getStudent,
  createStudent, updateStudent, deleteStudent
} from '../controllers/student.controller.js';
import { protect, restrictTo }  from '../middleware/auth.middleware.js';
import { validate }             from '../middleware/validate.middleware.js';
import {
  createStudentSchema,
  updateStudentSchema
} from '../schemas/student.schema.js';

const router = Router();

// All student routes require authentication
router.use(protect);

router.route('/')
  .get(getStudents)                                    // ADMIN + TEACHER
  .post(restrictTo('ADMIN'), validate(createStudentSchema), createStudent);
  // Only ADMIN can create students

router.route('/:id')
  .get(getStudent)                                     // ADMIN + TEACHER
  .patch(restrictTo('ADMIN'), validate(updateStudentSchema), updateStudent)
  .delete(restrictTo('ADMIN'), deleteStudent);

export default router;