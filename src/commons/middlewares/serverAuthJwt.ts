import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequestError } from "../utils/AppError";
import { optional } from "zod";

const serverAuthSecret = process.env.SERVER_AUTH_SECRET;
const serverAuthPayload = process.env.SERVER_AUTH_PAYLOAD;

export const requireValidateJWT = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let token = req.headers.authorization as string;
		if (token) {
			const decoded: any = jwt.verify(token, serverAuthSecret);
			if (decoded && decoded.name === serverAuthPayload) {
				// If the jwt is valid, then check return payload
				token = jwt.sign(
					{
						name: serverAuthPayload,
					},
					serverAuthSecret,
					{
						expiresIn: "1m",
					}
				);

				res.set("Authorization", token);
				return next();
			}
		}

		throw new CustomRequestError(401, {
			reasonPhrase: "UNAUTHORIZED",
			message: "Not authorized server",
		});
	} catch (err) {
		throw new CustomRequestError(401, {
			reasonPhrase: "UNAUTHORIZED",
			message: "Not authorized server",
		});
	}
};

export const optionalValidateJWT = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let token = req.headers.authorization as string;
		if (token) {
			const decoded: any = jwt.verify(token, serverAuthSecret);
			if (decoded && decoded.name === serverAuthPayload) {
				// If the jwt is valid, then check return payload
				token = jwt.sign(
					{
						name: serverAuthPayload,
					},
					serverAuthSecret,
					{
						expiresIn: "1m",
					}
				);

				res.set("Authorization", token);
				return next();
			} else {
				throw new CustomRequestError(401, {
					reasonPhrase: "UNAUTHORIZED",
					message: "Not authorized server",
				});
			}
		}

		next();
	} catch (err) {
		throw new CustomRequestError(401, {
			reasonPhrase: "UNAUTHORIZED",
			message: "Not authorized server",
		});
	}
};
