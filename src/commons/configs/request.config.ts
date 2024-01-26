import jwt from "jsonwebtoken";
import { Request, Response, Express } from "express";
import axios from "axios";
import { CustomRequestError } from "../utils/AppError";

const serverUrls = {
	primary: `${process.env.PRIMARY_SERVER_URL}`,
	payment: `${process.env.PAYMENT_SERVER_URL}`,
};
const isProduction = process.env.NODE_ENV === "production";
const serverAuthSecret = process.env.SERVER_AUTH_SECRET;
const serverAuthPayload = process.env.SERVER_AUTH_PAYLOAD;
const validateJWT = (response: any) => {
	const token = response.headers.authorization;
	if (token) {
		const decoded: any = jwt.verify(token, serverAuthSecret);
		if (decoded && decoded.name === serverAuthPayload) {
			return true;
		}
	}

	throw new CustomRequestError(401, {
		reasonPhrase: "UNAUTHORIZED",
		message: "Not authorized server",
	});
};

// Sign request with jwt token
axios.interceptors.request.use(
	(config) => {
		config.headers["Authorization"] = jwt.sign(
			{
				name: serverAuthPayload,
			},
			serverAuthSecret,
			{
				expiresIn: "1m",
			}
		);
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

const requestTemplate = (req: Request, res: Response, url: string) => {
	return async (path?: string, options?: any) => {
		try {
			options = options || {};
			path = path || req.originalUrl;
			const headers = {
				...req.headers,
				"Content-Type": "application/json",
			};

			const response = await axios.request({
				url: `${url}${path}`,
				headers,
				body: options.data || req.body,
				...options,
			});

			validateJWT(response);

			return response.data.data || response.data;
		} catch (err) {
			if (err.response) {
				const { status, data } = err.response;
				throw new CustomRequestError(status, data.error);
			} else {
				if (err.type === "CustomRequestError") {
					throw err;
				}
				return res.error(err);
			}
		}
	};
};

export default function (app: Express) {
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
