import express from 'express';
import { UPLOAD_FILE_ENDPOINT } from '../constants/route';
import { uploadFile } from '../controllers/file.controller';
import checkAuth from '../middlewares/checkAuth';

const fileRoutes = express.Router();

fileRoutes.post(UPLOAD_FILE_ENDPOINT, checkAuth, uploadFile);

export default fileRoutes;
