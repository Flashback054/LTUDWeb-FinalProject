import ControllerFactory from "./controller.factory";
import AppError from "../utils/AppError";
import CloudinaryStorageFactory from "../configs/cloudinary.config";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

const CloudinaryUserStorage = new CloudinaryStorageFactory(User);

// For admin to manage users
export const createUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Check if email is already taken
		if (await User.findOne({ email: req.body.email })) {
			throw new AppError(
				400,
				"BAD_REQUEST",
				`Email ${req.body.email} đã được sử dụng.`,
				{
					email: req.body.email,
				}
			);
		}

		const newUser = await User.create(req.body);
		// Remove password and from user object
		newUser.password = undefined;

		res.created(newUser);
	} catch (err) {
		// Delete uploaded image
		if (req.file) {
			try {
				await cloudinary.uploader.destroy(req.file.filename);
			} catch (err) {
				console.log(err);
			}
		}

		throw err;
	}
};

export const getAllUsers = ControllerFactory.getAll(User);
export const getUser = ControllerFactory.getOne(User);
export const updateUser = ControllerFactory.updateOne(User);
export const deleteUser = ControllerFactory.deleteOne(User);

// ----- For customer to manage their own account -----
// For uploading user image

export const uploadUserImage = CloudinaryUserStorage.upload.single("image");

export const updateMe = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Check allowed fields (form data validation with zod is not working)
		const allowedFields = ["name", "phone", "image", "imagePublicId"];
		const receivedFields = Object.keys(req.body);
		const notAllowedFields = receivedFields.filter(
			(field) => !allowedFields.includes(field)
		);
		if (notAllowedFields.length > 0) {
			const metadata = {};
			notAllowedFields.forEach((field) => {
				metadata[field] = req.body[field];
			});

			throw new AppError(
				400,
				"BAD_REQUEST",
				`Không thể cập nhật trường ${notAllowedFields.join(", ")}.`,
				metadata
			);
		}

		// Update user document
		const oldUser = await User.findById(req.user.id)
			.select("+imagePublicId")
			.lean({ virtuals: true });

		const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
			new: true,
			runValidators: true,
		});

		// Delete old image
		if (
			oldUser?.image &&
			oldUser.image !== updatedUser.image &&
			!(oldUser.image.search("default") !== -1) // prevent deleting default image
		) {
			// Use cloudinary to delete old image
			try {
				await cloudinary.uploader.destroy(oldUser.imagePublicId);
			} catch (err) {
				console.log(err);
			}
		}

		res.ok(updatedUser);
	} catch (err) {
		// Delete uploaded image
		if (req.file) {
			try {
				await cloudinary.uploader.destroy(req.file.filename);
			} catch (err) {
				console.log(err);
			}
		}

		throw err;
	}
};

export const setUserId = (req: Request, res: Response, next: NextFunction) => {
	req.params.id = req.user.id.toString();
	next();
};
