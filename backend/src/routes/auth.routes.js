import {Router} from 'express';
import {login, refresh,logout,getMe} from '../controllers/auth.controller.js';
import {protect} from '../middleware/auth.middleware.js';

const router=Router();

//Public routes -no token needed
router.post('/login',login);
router.post('/refresh',refresh);
router.post('/logout',logout);

//Protected route -must be logged in
router.get('/me',protect,getMe);

export default router;