import { Router } from 'express';
import {
  createGrade, getGrades, updateGrade,
  deleteGrade, getStudentGradeSummary
} from '../controllers/grade.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate }            from '../middleware/validate.middleware.js';
import { createGradeSchema, updateGradeSchema } from '../schemas/grade.schema.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(getGrades)
  .post(validate(createGradeSchema), createGrade);

router.get('/summary/:studentId', getStudentGradeSummary);

router.route('/:id')
  .patch(validate(updateGradeSchema), updateGrade)
  .delete(restrictTo('ADMIN'), deleteGrade);

export default router;