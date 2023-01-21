import express from 'express';
import { LOGIN_ENDPOINT, SIGNUP_ENDPOINT } from '../constants/route';
import { loginUser, registerUser } from '../controllers/auth.controller';

const router = express.Router();

router.post(SIGNUP_ENDPOINT, registerUser);

router.post(LOGIN_ENDPOINT, loginUser);

export default router;
