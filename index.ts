import express, { Application, Request, Response } from 'express';
import 'dotenv/config';

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
	res.json({
		hello: 'world'
	});
});

const PORT: number = Number(process.env.PORT) || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, (): void => console.log(`Server started on ${PORT}`));
