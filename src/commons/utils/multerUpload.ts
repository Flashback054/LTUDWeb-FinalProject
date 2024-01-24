import multer from "multer";
import AppError from "./AppError";
import { Request } from "express";

const multerStorage = multer.memoryStorage();

// Check if uploaded file is image
const multerFilter = (req: Request, file: any, cb: Function) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(
			new AppError(
				400,
				"INVALID_ARGUMENTS",
				"Vui lòng upload file có định dạng ảnh"
			),
			false
		);
	}
};

exports.upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});
