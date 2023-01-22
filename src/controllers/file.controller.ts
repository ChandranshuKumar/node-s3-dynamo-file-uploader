import { Request, Response, NextFunction } from 'express';
import AWS from 'aws-sdk';
import { ERROR_CODES, HTTP } from '../constants/codesAndStatuses';
import { constructErrorResponse, constructSuccessResponse } from '../helpers/response';
import { AWS_CONFIG } from '../configs/aws';
import Files from '../models/File';
import { IUser } from '../models/User';

const s3 = new AWS.S3({
	accessKeyId: AWS_CONFIG.ACCESS_KEY,
	secretAccessKey: AWS_CONFIG.SECRET_KEY
});

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name = '', type = '', size = null, encoding = 'base64', blob = '' } = req.body;
		if (!name || !type || !encoding || !blob) {
			res.status(HTTP.BAD_REQUEST).json(constructErrorResponse(ERROR_CODES.INSUFFICIENT_FILE_DATA));
			return;
		}

		const dedupeFile = await Files.findOne({ name });
		if (dedupeFile) {
			res.status(HTTP.CONFLICT).json(constructErrorResponse(ERROR_CODES.DEDUPE_FILE));
			return;
		}

		const fileBuffer = Buffer.from(blob, encoding);
		const params: AWS.S3.Types.PutObjectRequest = {
			Bucket: AWS_CONFIG.FILE_UPLOAD_BUCKET,
			Key: name,
			ContentEncoding: encoding,
			ContentType: type,
			Body: fileBuffer
		};
		s3.upload(params, async (err, data) => {
			if (err) {
				res
					.status(HTTP.SERVICE_UNAVAILABLE)
					.json(constructErrorResponse(ERROR_CODES.FILE_UPLOAD_FAILED));
				return;
			}

			const currentUser: IUser = res.locals.user;
			const file = new Files({
				uploaded_by: currentUser._id,
				name: data.Key,
				s3_url: data.Location,
				type,
				size,
				encoding
			});
			const newFile = await file.save();
			res.status(HTTP.CREATED).json(
				constructSuccessResponse({
					file: {
						id: newFile._id,
						fileName: newFile.name,
						url: newFile.s3_url
					}
				})
			);
			return;
		});
	} catch (err) {
		next(err);
	}
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id: fileId = '' } = req.params;
		if (!fileId) {
			res.status(HTTP.BAD_REQUEST).json(constructErrorResponse(ERROR_CODES.INVALID_FILE_ID));
			return;
		}

		const file = await Files.findById(fileId);
		if (!file || file.deleted_at) {
			res.status(HTTP.NOT_FOUND).json(constructErrorResponse(ERROR_CODES.FILE_NOT_FOUND));
			return;
		}

		const currentUser: IUser = res.locals.user;
		if (file.uploaded_by.toString() !== currentUser._id.toString()) {
			res.status(HTTP.FORBIDDEN).json(constructErrorResponse(ERROR_CODES.FORBIDDEN));
			return;
		}

		const params: AWS.S3.Types.DeleteObjectRequest = {
			Bucket: AWS_CONFIG.FILE_UPLOAD_BUCKET,
			Key: file.name
		};

		s3.deleteObject(params, async (err) => {
			if (err) {
				res
					.status(HTTP.SERVICE_UNAVAILABLE)
					.json(constructErrorResponse(ERROR_CODES.FILE_DELETE_FAILED));
				return;
			}

			file.deleted_at = new Date();
			await file.save();
			res.send(HTTP.SUCCESS).json(constructSuccessResponse());
		});
	} catch (err) {
		next(err);
	}
};

export const getFile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id: fileId = '' } = req.params;
		if (!fileId) {
			res.status(HTTP.BAD_REQUEST).json(constructErrorResponse(ERROR_CODES.INVALID_FILE_ID));
			return;
		}

		const file = await Files.findById(fileId);
		if (!file || file.deleted_at) {
			res.status(HTTP.NOT_FOUND).json(constructErrorResponse(ERROR_CODES.FILE_NOT_FOUND));
			return;
		}

		const currentUser: IUser = res.locals.user;
		if (file.uploaded_by.toString() !== currentUser._id.toString()) {
			res.status(HTTP.FORBIDDEN).json(constructErrorResponse(ERROR_CODES.FORBIDDEN));
			return;
		}

		res.status(HTTP.SUCCESS).json(
			constructSuccessResponse({
				file: {
					id: file._id,
					fileName: file.name,
					url: file.s3_url
				}
			})
		);
	} catch (err) {
		next(err);
	}
};

export const getAllFiles = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const currentUser: IUser = res.locals.user;
		const files = await Files.find({ uploaded_by: currentUser._id });

		if (!files) {
			res.send(HTTP.NOT_FOUND).json(constructErrorResponse(ERROR_CODES.FILES_NOT_FOUND));
			return;
		}

		const formatFiles = files
			.filter((file) => !file.deleted_at)
			.map((file) => {
				return {
					id: file._id,
					fileName: file.name,
					url: file.s3_url
				};
			});

		res.status(HTTP.SUCCESS).json(
			constructSuccessResponse({
				files: formatFiles
			})
		);
		return;
	} catch (err) {
		next(err);
	}
};
