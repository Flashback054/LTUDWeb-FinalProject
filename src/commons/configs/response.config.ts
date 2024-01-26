import { Express, Request, Response } from "express";
import axios from "axios";
import { CustomRequestError } from "../utils/AppError";

const serverUrls = {
	primary: `${process.env.PRIMARY_SERVER_URL}`,
	payment: `${process.env.PAYMENT_SERVER_URL}`,
};
const isProduction = process.env.NODE_ENV === "production";

const requestTemplate = (req: Request, res: Response, url: string) => {
	return async (path?: string, options?: any) => {
		try {
			options = options || {};
			path = path || req.originalUrl;
			const headers = {
				...req.headers,
				"Content-Type": "application/json",
			};

			// Generate a random number and add it to the request header jwt (Authorization)

			const response = await axios({
				url: `${url}${path}`,
				headers: headers,
				body: options.data || req.body,
				method: options.method || req.method,
				params: options.params || req.query,
				...options,
			});
			return response.data.data || response.data;
		} catch (err) {
			if (err.response) {
				const { status, data } = err.response;
				throw new CustomRequestError(status, data.error);
			} else {
				return res.error(err);
			}
		}
	};
};

export default function (app: Express) {
	// Define response methods
	app.response.ok = function (data: any) {
		this.status(200).json({
			data,
		});
	};
	app.response.created = function (data: any) {
		this.status(201).json({
			data,
		});
	};
	app.response.noContent = function () {
		this.status(204).json();
	};
	app.response.badRequest = function (error: any) {
		this.status(400).json({
			error,
		});
	};
	app.response.unauthorized = function (error: any) {
		this.status(401).json({
			error,
		});
	};
	app.response.forbidden = function (error: any) {
		this.status(403).json({
			error,
		});
	};
	app.response.notFound = function (error: any) {
		this.status(404).json({
			error,
		});
	};
	app.response.error = function (error: any) {
		this.status(500).json({
			error,
		});
	};

	app.request.request = {
		toPrimaryServer: requestTemplate(
			app.request,
			app.response,
			serverUrls.primary
		),
		toPaymentServer: requestTemplate(
			app.request,
			app.response,
			serverUrls.payment
		),
	};
}
