import { Request, Response, NextFunction } from "express";

export default (nestedParams: string | string[]) =>
	(req: Request, res: Response, next: NextFunction) => {
		if (typeof nestedParams === "string") {
			req.body[nestedParams] = req.params[nestedParams];
		} else {
			nestedParams.forEach((param) => {
				req.body[param] = req.params[param];
			});
		}

		next();
	};
