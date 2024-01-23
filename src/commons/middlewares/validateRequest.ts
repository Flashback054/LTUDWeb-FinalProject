import * as zod from "zod";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

export function validateRequest(schema: zod.ZodSchema<any>) {
	return function (req: Request, res: Response, next: NextFunction) {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			next();
		} catch (err) {
			next(err);
		}
	};
}

export function validateRequestId(idFieldName: string) {
	return function (req: Request, res: Response, next: NextFunction) {
		try {
			const schema = zod.object({
				params: zod.object({
					[idFieldName]: zod.string().superRefine((val, ctx) => {
						if (!mongoose.isValidObjectId(val)) {
							ctx.addIssue({
								code: zod.ZodIssueCode.custom,
								message: `${val} không phải là ID hợp lệ`,
							});
						}
					}),
				}),
			});

			schema.parse({
				params: req.params,
			});

			next();
		} catch (err) {
			next(err);
		}
	};
}
