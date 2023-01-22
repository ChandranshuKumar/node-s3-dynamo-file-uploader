import { Request, Response, NextFunction } from 'express';
import { HTTP } from '../constants/codesAndStatuses';
import { constructSuccessResponse } from '../helpers/response';
import { IUser } from '../models/User';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const currentUser: IUser = res.locals.user;
		res.status(HTTP.SUCCESS).json(
			constructSuccessResponse({
				user: {
					id: currentUser._id,
					email: currentUser.email,
					is_verified: currentUser.is_verified
				}
			})
		);
		return;
	} catch (err) {
		next(err);
	}
};
