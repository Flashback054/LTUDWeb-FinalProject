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
