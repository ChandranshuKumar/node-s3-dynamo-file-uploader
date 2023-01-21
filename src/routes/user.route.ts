import express from 'express';
import { GET_USER_ENDPOINT } from '../constants/route';
import { getUser } from '../controllers/user.controller';
import checkAuth from '../middlewares/checkAuth';

const userRoutes = express.Router();

userRoutes.get(GET_USER_ENDPOINT, checkAuth, getUser);

export default userRoutes;
