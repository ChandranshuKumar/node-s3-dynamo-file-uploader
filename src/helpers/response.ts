export const constructErrorResponse = (code: string, message?: string) => {
	return {
		success: false,
		error: {
			code,
			...(message ? { message } : {})
		}
	};
};

export const constructSuccessResponse = (data: unknown) => {
	return {
		success: true,
		...(data ? { data } : {})
	};
};
