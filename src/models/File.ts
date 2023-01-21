import { model, Schema, Document } from 'mongoose';

export interface IFiles extends Document {
	name: string;
	type: string;
	size: number;
	encoding: string;
	s3_url: string;
	e_tag: string;
	created_at: Date;
}

const filesSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	type: {
		type: String,
		required: true
	},
	size: {
		type: Number
	},
	encoding: {
		type: String,
		required: true
	},
	s3_url: {
		type: String
	},
	e_tag: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

const Files = model<IFiles>('Files', filesSchema);

export default Files;
