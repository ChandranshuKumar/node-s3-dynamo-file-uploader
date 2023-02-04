import { Request, Response } from 'express';
import { ERROR_CODES, HTTP } from '../constants/codesAndStatuses';
import { Err } from '../interfaces/common';
import { constructErrorResponse } from './response';

export const handle404 = (req: Request, res: Response) => {
	res.status(HTTP.NOT_FOUND).json(constructErrorResponse(ERROR_CODES.NOT_FOUND));
	return;
};

export const globalErrorHandling = (err: Err, req: Request, res: Response) => {
	const status = err.status || HTTP.INTERNAL_SERVER_ERROR;
	const errMessage = err.message || ERROR_CODES.SERVER_ERR;
	res.status(status).json(constructErrorResponse(errMessage));
	return;
};
