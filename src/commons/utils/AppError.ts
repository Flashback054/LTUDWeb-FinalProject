import { any } from "zod";

export default class AppError extends Error {
	public statusCode: number;
	public errorCode: string;
	public errorFields: any;
	public isOperational: boolean;

	constructor(
		statusCode: number,
		errorCode: string,
		errorMessage: string,
		errorFields?: any
	) {
		super(errorMessage);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		this.errorFields = errorFields;
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

export class CustomRequestError extends Error {
	public statusCode: number;
	public error: any;

	constructor(statusCode: number, error: any) {
		super(error.message);
		this.statusCode = statusCode;
		this.error = error;

		Error.captureStackTrace(this, this.constructor);
	}
}
