import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { ERROR_CODES, HTTP } from '../constants/codesAndStatuses';
import { constructErrorResponse, constructSuccessResponse } from '../helpers/response';
import { isValidEmail } from '../helpers/validations';
import { comparePassword, createPasswordHash } from '../utils/password.util';
import { createJwtToken } from '../utils/token.util';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email = '', password = '' } = req.body;

		if (!email || !password) {
			res.status(HTTP.BAD_REQUEST).json(constructErrorResponse(ERROR_CODES.BAD_REQUEST));
			return;
		}

		if (!isValidEmail(email)) {
			res.status(HTTP.BAD_REQUEST).json(constructErrorResponse(ERROR_CODES.INVALID_EMAIL));
			return;
		}

		const emailExists = await User.findOne({ email });
		if (emailExists) {
			res.status(HTTP.BAD_REQUEST).json(constructErrorResponse(ERROR_CODES.DEDUPE_EMAIL));
			return;
		}

		const hashedPassword = await createPasswordHash(password);
		const createUser = new User({ email, password: hashedPassword });
		const newUser = await createUser.save();
		const token = createJwtToken({ userId: `${newUser._id}` });
		res.status(HTTP.CREATED).json(constructSuccessResponse({ token }));
	} catch (err) {
		next(err);
	}
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email = '', password = '' } = req.body;

		if (!email || !password) {
			res.status(HTTP.BAD_REQUEST).json(constructErrorResponse(ERROR_CODES.BAD_REQUEST));
			return;
		}

		const user = await User.findOne({ email });
		if (!user) {
			res.status(HTTP.NOT_FOUND).json(constructErrorResponse(ERROR_CODES.EMAIL_NOT_FOUND));
			return;
		}

		const isPasswordMatched = await comparePassword(password, user.password);
		if (!isPasswordMatched) {
			res.status(HTTP.BAD_REQUEST).json(constructErrorResponse(ERROR_CODES.INVALID_PASSWORD));
			return;
		}

		const token = createJwtToken({ userId: `${user._id}` });
		res.status(HTTP.SUCCESS).json(constructSuccessResponse({ token }));
		return;
	} catch (err) {
		next(err);
	}
};
