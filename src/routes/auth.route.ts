import express from 'express';
import { LOGIN_ENDPOINT, SIGNUP_ENDPOINT } from '../constants/route';
import { loginUser, registerUser } from '../controllers/auth.controller';

const authRoutes = express.Router();

authRoutes.post(SIGNUP_ENDPOINT, registerUser);

authRoutes.post(LOGIN_ENDPOINT, loginUser);

export default authRoutes;
