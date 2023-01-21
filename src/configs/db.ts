import { ConnectOptions } from 'mongoose';

const DB_ENDPOINT: string = process.env.DB_URL ?? '';
const DB_USERNAME: string = process.env.DB_USERNAME ?? '';
const DB_PASSWORD: string = process.env.DB_USER_PASSWORD ?? '';
const DB_URL: string = DB_ENDPOINT.replace('<username>', DB_USERNAME).replace(
	'<password>',
	DB_PASSWORD
);

interface DbConfigType {
	uri: string;
	options: ConnectOptions;
}

export const DB_CONFIG: DbConfigType = {
	uri: DB_URL,
	options: {
		keepAlive: true,
		connectTimeoutMS: 30000
	}
};
