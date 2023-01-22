import { model, Schema, Document } from 'mongoose';

export interface IUser extends Document {
	email: string;
	password: string;
	is_verified: boolean;
	phone_number: string;
	first_name: string;
	last_name: string;
	avatar: string;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
}

const userSchema = new Schema<IUser>({
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	phone_number: String,
	first_name: String,
	last_name: String,
	avatar: String,
	is_verified: {
		type: Boolean,
		default: false
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: Date,
	deleted_at: Date
});

const User = model<IUser>('User', userSchema);

export default User;
