import { Request, Response, NextFunction } from "express";

export const setImagePath = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.file) return next();

	const file = req.file as Express.Multer.File;

	req.body.image = file.path;
	req.body.imagePublicId = file.filename;

	return next();
};
