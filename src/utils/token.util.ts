import { JwtPayload, verify, sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/common';

type UserPayload = {
	userId: string;
};

type CustomJwtPayload = UserPayload & (JwtPayload | string);

const THIRY_MINUTES_EXPIRY = Math.floor((Date.now() / 1000) + (60 * 30));

export const createJwtToken = (payload: UserPayload) => {
	return sign(payload, JWT_SECRET, { expiresIn: THIRY_MINUTES_EXPIRY, algorithm: 'HS256' });
};

export const verifyJwtToken = (token: string) => {
	try {
		const payload = verify(token, JWT_SECRET);
		return (payload as CustomJwtPayload).userId;
	} catch (err) {
		return;
	}
};
