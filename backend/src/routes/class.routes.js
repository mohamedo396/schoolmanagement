import { Router } from 'express';
import {
  getClasses, getClass,
  createClass, updateClass, deleteClass
} from '../controllers/class.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate }            from '../middleware/validate.middleware.js';
import { createClassSchema, updateClassSchema } from '../schemas/class.schema.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(getClasses)
  .post(restrictTo('ADMIN'), validate(createClassSchema), createClass);

router.route('/:id')
  .get(getClass)
  .patch(restrictTo('ADMIN'), validate(updateClassSchema), updateClass)
  .delete(restrictTo('ADMIN'), deleteClass);

export default router;