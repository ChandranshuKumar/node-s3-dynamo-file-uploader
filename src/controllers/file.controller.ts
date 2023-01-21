import { Request, Response, NextFunction } from 'express';
import AWS from 'aws-sdk';
import { ERROR_CODES, HTTP } from '../constants/codesAndStatuses';
import { constructErrorResponse, constructSuccessResponse } from '../helpers/response';
import { AWS_CONFIG } from '../configs/aws';
import Files from '../models/File';

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

			const ETag = data.ETag.replace(/['"]+/g, '');
			const dedupeFile = await Files.findOne({ e_tag: ETag });
			if (dedupeFile) {
				res.status(HTTP.CONFLICT).json(constructErrorResponse(ERROR_CODES.DEDUPE_FILE));
				return;
			}

			const file = new Files({
				name: data.Key,
				e_tag: ETag,
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
