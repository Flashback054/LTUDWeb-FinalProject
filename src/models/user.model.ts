import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import * as bcrypt from "bcryptjs";
import { isEmail } from "validator";
import { NextFunction } from "express";
import { ObjectId, Types } from "mongoose";

interface IUser {
	id: Types.ObjectId;
	name: string;
	email: string;
	password?: string;
	role: string;
	authType: string;
	googleId: string;
	image: string;
	imagePublicId: string;
	phone: string;
	createdAt: Date;
	passwordUpdatedAt: Date;
}

interface IUserMethods {
	isCorrectPassword: (inputPassword: string) => Promise<boolean>;
	updatePassword: (newPassword: string) => Promise<void>;
	isChangedPasswordAfter: (JWTTimestamp: number) => boolean;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, {}, IUserMethods>(
	{
		name: {
			type: String,
			required: [true, "Hãy nhập tên của bạn"],
		},
		email: {
			type: String,
			required: [true, "Hãy nhập email của bạn"],
			unique: true,
			validate: [isEmail, "Email không hợp lệ"],
		},
		password: {
			type: String,
			minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
			select: false,
		},
		role: {
			type: String,
			enum: ["admin", "customer"],
			default: "customer",
		},
		image: {
			type: String,
			default: process.env.CLOUDINARY_USER_DEFAULT_IMAGE || "default.jpg",
		},
		imagePublicId: {
			type: String,
			default: process.env.CLOUDINARY_USER_DEFAULT_IMAGE_PUBLIC_ID,
			select: false,
		},
		phone: {
			type: String,
			validate: {
				validator: function (phone: string) {
					const regex = /^\d{10}$/;
					return regex.test(phone);
				},
				message: "Số điện thoại phải có 10 chữ số",
			},
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		passwordUpdatedAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		authType: {
			type: String,
			enum: ["local", "google"],
			default: "local",
		},
		googleId: {
			type: String,
			unique: true,
			sparse: true,
		},
	},
	{
		virtuals: {
			id: {
				get: function () {
					return this._id;
				},
			},
		},
		toJSON: { virtuals: true, versionKey: false },
	}
);

userSchema.index({ email: 1 });

////////// MIDDLEWARE ///////

// Decrypt password
userSchema.pre("save", async function (next) {
	// only run this function if Password is modified
	if (!this.password || !this.isModified("password")) return next();

	// 12 : how CPU intensive to hash password
	this.password = await bcrypt.hash(this.password, 12);

	next();
});

// Update passwordUpdatedAt
userSchema.pre("save", function (next) {
	if (!this.password || !this.isModified("password") || this.isNew)
		return next();

	// A little hack: minus 1 seconds : b/c this save process might finish after JWT being created -> error
	this.passwordUpdatedAt = new Date(Date.now() - 1000);
	next();
});

async function hashPasswordOnUpdate(next: NextFunction) {
	const data = this.getUpdate();
	if (data.password) {
		data.password = await bcrypt.hash(data.password, 12);
		data.passwordUpdatedAt = Date.now() - 1000;
	}
	next();
}

userSchema.pre("updateOne", hashPasswordOnUpdate);
userSchema.pre("findOneAndUpdate", hashPasswordOnUpdate);
userSchema.pre("updateMany", hashPasswordOnUpdate);

////////// METHODS //////////
userSchema.methods.isCorrectPassword = async function (inputPassword: string) {
	return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.updatePassword = async function (newPassword: string) {
	this.password = newPassword;
	await this.save();
};

// Check if the password is changed after the token was issued
userSchema.methods.isChangedPasswordAfter = function (JWTTimestamp: number) {
	// Password has been changed after user being created
	if (this.passwordUpdatedAt) {
		const passwordChangeTime = this.passwordUpdatedAt.getTime() / 1000;

		return JWTTimestamp < passwordChangeTime;
	}

	// False: token was issued before password change time
	return false;
};

userSchema.plugin(mongooseLeanVirtuals);

const User = mongoose.model<IUser, UserModel>("User", userSchema);

// Google User
interface GoogleProfile {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
}

interface GoogleUser {
	id: string;
	displayName: string;
	name: {
		familyName: string;
		givenName: string;
	};
	emails: Array<{ value: string; verified: boolean }>;
	photos: Array<{ value: string }>;
	provider: string;
	_raw: string;
	_json: GoogleProfile;
}

export { GoogleUser, GoogleProfile };
export default User;
export { IUser, UserModel };
