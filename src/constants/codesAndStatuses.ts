export const HTTP = {
	SUCCESS: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
	SERVICE_UNAVAILABLE: 503
} as const;

export const ERROR_CODES = {
	BAD_REQUEST: 'bad_request',
	NOT_FOUND: 'not_found',
	SERVER_ERR: 'internal_server_error',
	UNAUTHORIZED: 'unauthorized',
	FORBIDDEN: 'forbidden',
	INVALID_TOKEN: 'invalid_token',
	USER_NOT_FOUND: 'user_not_found',
	EMAIL_NOT_FOUND: 'email_not_found',
	DEDUPE_EMAIL: 'email_exists',
	INVALID_EMAIL: 'invalid_email',
	INVALID_PASSWORD: 'invalid_password',
	INSUFFICIENT_FILE_DATA: 'insufficient_file_data',
	FILE_UPLOAD_FAILED: 'file_upload_failed',
	DEDUPE_FILE: 'file_exists'
} as const;
