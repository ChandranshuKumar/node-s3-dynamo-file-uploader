import { Request, Response, NextFunction } from 'express';
import { ERROR_CODES, HTTP } from '../constants/codesAndStatuses';
import { constructErrorResponse } from '../helpers/response';
import User from '../models/User';
import { verifyJwtToken } from '../utils/token.util';

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const header = req.headers.authorization;
		if (!header) {
			res.status(HTTP.UNAUTHORIZED).json(constructErrorResponse(ERROR_CODES.UNAUTHORIZED));
			return;
		}

		const token = header.split('Bearer ')[1];
		if (!token) {
			res.status(HTTP.UNAUTHORIZED).json(constructErrorResponse(ERROR_CODES.UNAUTHORIZED));
			return;
		}

		const userId: string | undefined = verifyJwtToken(token);
		if (!userId) {
			res.status(HTTP.UNAUTHORIZED).json(constructErrorResponse(ERROR_CODES.INVALID_TOKEN));
			return;
		}

		const currentUser = await User.findById(userId);
		if (!currentUser) {
			res.status(HTTP.NOT_FOUND).json(constructErrorResponse(ERROR_CODES.USER_NOT_FOUND));
			return;
		}

		res.locals.user = currentUser;
		next();
	} catch (err) {
		next(err);
	}
};

export default checkAuth;
