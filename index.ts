import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './src/routes/auth.route';
import userRoutes from './src/routes/user.route';
import { HOST, ORIGIN, PORT } from './src/configs/common';
import { AUTHOR_GITHUB, AUTH_BASE_URL, USER_BASE_URL } from './src/constants/route';
import { globalErrorHandling, handle404 } from './src/helpers/error';
import { DB_CONFIG } from './src/configs/db';

const app: Application = express();

app.use(express.json());
app.use(
	cors({
		credentials: true,
		origin: ORIGIN,
		optionsSuccessStatus: 200
	})
);

app.get('/', (req: Request, res: Response) => {
	res.redirect(AUTHOR_GITHUB);
});

app.use(AUTH_BASE_URL, authRoutes);

app.use(USER_BASE_URL, userRoutes);

app.use('*', handle404);

app.use(globalErrorHandling);

const connectDBAndStartServer = async (): Promise<void> => {
	try {
		mongoose.set('strictQuery', false);
		await mongoose.connect(DB_CONFIG.uri, DB_CONFIG.options);
		console.log('MongoDB connected successfully');

		app.listen(PORT, HOST, (): void => console.log(`Server started on ${PORT}`));
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

connectDBAndStartServer();
