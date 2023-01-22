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
				owner: currentUser._id,
				name: data.Key,
				s3_url: data.Location,
				s3_e_tag: data.ETag.replace(/['"]+/g, ''),
				type,
				size,
				encoding
			});
			const newFile = await file.save();
			res.status(HTTP.CREATED).json(
				constructSuccessResponse({
					file: {
						id: newFile._id,
						fileName: newFile.name
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
