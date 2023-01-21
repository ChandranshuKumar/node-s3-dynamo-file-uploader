export const AWS_ACCESS_KEY: string = process.env.AWS_ACCESS_KEY ?? '';
export const AWS_SECRET_ACCESS_KEY: string = process.env.AWS_SECRET_ACCESS_KEY ?? '';
export const AWS_FILE_BUCKET_NAME: string = process.env.AWS_FILE_BUCKET_NAME ?? '';

export const AWS_CONFIG = {
	ACCESS_KEY: AWS_ACCESS_KEY,
	SECRET_KEY: AWS_SECRET_ACCESS_KEY,
	FILE_UPLOAD_BUCKET: AWS_FILE_BUCKET_NAME
};
