import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const createPasswordHash = async (passowrd: string) => {
	const hashedPassword = await bcrypt.hash(passowrd, SALT_ROUNDS);
	return hashedPassword;
};

export const comparePassword = async (incomingPassword: string, savedPassword: string) => {
	const isMatched = await bcrypt.compare(incomingPassword, savedPassword);
	return isMatched;
};
