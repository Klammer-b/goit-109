import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserValidationSchema } from '../validation/registerUserValidationSchema.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserValidationSchema } from '../validation/loginUserValidationSchema.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserValidationSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
  '/login',
  validateBody(loginUserValidationSchema),
  ctrlWrapper(loginUserController),
);
authRouter.post('/refresh-session', ctrlWrapper(refreshSessionController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));

export default authRouter;
