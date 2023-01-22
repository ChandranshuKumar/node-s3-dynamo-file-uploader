import express from 'express';
import { DELETE_FILE_ENDPOINT, UPLOAD_FILE_ENDPOINT } from '../constants/route';
import { deleteFile, uploadFile } from '../controllers/file.controller';
import checkAuth from '../middlewares/checkAuth';

const fileRoutes = express.Router();

fileRoutes.post(UPLOAD_FILE_ENDPOINT, checkAuth, uploadFile);

fileRoutes.delete(DELETE_FILE_ENDPOINT, checkAuth, deleteFile);

export default fileRoutes;
