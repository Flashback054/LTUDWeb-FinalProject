import { Express, Request, Response } from "express";
import axios from "axios";

const serverUrls = {
	primary: `${process.env.PRIMARY_SERVER_URL}`,
	payment: `${process.env.PAYMENT_SERVER_URL}`,
};
const isProduction = process.env.NODE_ENV === "production";

const requestTemplate = (req: Request, res: Response, url: string) => {
	return async (path: string, options: any) => {
		try {
			const headers = {
				...req.headers,

				"Content-Type": "application/json",
			};
			console.log({
				url,
				path,
			});

			const response = await axios({
				url: `${url}${path}`,
				headers,
				data: options.data || req.body,
				method: options.method || req.method,
				params: options.params || req.query,
				...options,
			});
			return response.data.data || response.data;
		} catch (err) {
			if (err.response) {
				const { status, data } = err.response;
				if (status === 500) {
					return res.error(data.error);
				}
				return res.status(status).json(data);
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
