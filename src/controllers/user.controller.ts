import { Request, Response, NextFunction } from 'express';
import { ERROR_CODES, HTTP } from '../constants/codesAndStatuses';
import { constructErrorResponse, constructSuccessResponse } from '../helpers/response';
import User from '../models/User';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const currentUserId = res.locals.userId ?? '';
		const currentUser = await User.findById(currentUserId);
		if (!currentUser) {
			res.status(HTTP.NOT_FOUND).json(constructErrorResponse(ERROR_CODES.USER_NOT_FOUND));
			return;
		}
		res.status(HTTP.SUCCESS).json(
			constructSuccessResponse({
				user: {
					id: currentUser._id,
					email: currentUser.email,
					isVerified: currentUser.isVerified
				}
			})
		);
		return;
	} catch (err) {
		next(err);
	}
};
