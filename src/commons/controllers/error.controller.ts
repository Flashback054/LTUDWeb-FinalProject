import * as zod from "zod";
import mongoose from "mongoose";
import { fromZodError } from "zod-validation-error";
import convertToReadableMetadata from "../utils/convertToReadableMetadata";
import { Request, Response, NextFunction } from "express";
import AppError, { CustomRequestError } from "../utils/AppError";

export default (err: any, req: Request, res: Response, next: NextFunction) => {
	// Check if erro is zod's error
	if (err instanceof zod.ZodError) {
		const validationErrors = fromZodError(err, {
			prefix: "Lỗi dữ liệu",
			includePath: false,
			unionSeparator: ", hoặc",
		});

		return res.badRequest({
			errorMessage: validationErrors.message,
			errorCode: "INVALID_ARGUMENTS",
			errorFields: convertToReadableMetadata(validationErrors.details),
		});
	}

	// Check if error is Mongoose ValidationError
	if (err instanceof mongoose.Error.ValidationError) {
		const validationErrorMessages = Object.values(err.errors).map(
			(error: { message: string }) => error.message
		);

		return res.badRequest({
			errorMessage: validationErrorMessages.join("; "),
			errorCode: "INVALID_ARGUMENTS",
			errorFields: err.errors,
		});
	} else if (err instanceof mongoose.Error.CastError) {
		// Check if error is Mongoose CastError
		return res.badRequest({
			errorMessage: `Không thể chuyển đổi ${err.value} thành ${err.kind}}`,
			errorCode: "CAST_ERROR",
			errorFields: {
				[err.path]: {
					value: err.value,
					kind: err.kind,
					message: `Không thể chuyển đổi ${err.value} thành ${err.kind}}`,
				},
			},
		});
	} else if (err.code === 11000) {
		// Duplicate key error
		const keys = Object.keys(err.keyValue);
		const values = Object.values(err.keyValue);
		const errorMessage = `Trường (${keys.join(", ")}) (${values.join(
			", "
		)}) đã tồn tại`;

		return res.badRequest({
			errorMessage: errorMessage,
			errorCode: "DUPLICATE_KEY",
			errorFields: err.keyValue,
		});
	}

	if (err instanceof CustomRequestError) {
		return res.status(err.statusCode).json(err.error);
	}

	// Check if error is AppError (custom error)
	if (err instanceof AppError && err.isOperational) {
		return res.status(err.statusCode).json({
			message: err.message,
			reasonPhrase: err.errorCode,
			errorFields: err.errorFields,
		});
	}

	console.log(err);
	return res.error({
		message: "Có lỗi xảy ra. Xin hãy liên hệ với admin.",
		reasonPhrase: "INTERNAL_SERVER_ERROR",
	});
};
