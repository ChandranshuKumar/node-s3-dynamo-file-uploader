import { model, Schema, Document } from 'mongoose';

export interface IUser extends Document {
	email: string;
	password: string;
	isVerified: boolean;
	createdAt: Date;
}

const userSchema = new Schema({
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
	isVerified: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const User = model<IUser>('User', userSchema);

export default User;
