import { Router } from 'express';
import {
  markAttendance, getAttendance,
  getStudentAttendanceSummary
} from '../controllers/attendance.controller.js';
import { protect }  from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { markAttendanceSchema } from '../schemas/attendance.schema.js';

const router = Router();

router.use(protect);

router.post('/',   validate(markAttendanceSchema), markAttendance);
router.get('/',    getAttendance);
router.get('/summary/:studentId', getStudentAttendanceSummary);

export default router;