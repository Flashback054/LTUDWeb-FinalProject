import { v2 as cloudinary } from "cloudinary";
import AppError from "../utils/AppError";
import APIFeatures from "../utils/ApiFeatures";
import { Model, PopulateOptions } from "mongoose";
import { Request, Response, NextFunction } from "express";

type FactoryQueryOptions = {
	allowNestedQueries?: string[];
	populate?: PopulateOptions | (string | PopulateOptions)[];
};

let createOne =
	(Model: Model<any, any, any>, options?: FactoryQueryOptions) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const newDoc = await Model.create(req.body);

			if (options?.populate && newDoc.populate) {
				await newDoc.populate(options.populate);
			}

			res.created(newDoc);
		} catch (err) {
			// Delete uploaded image
			if (req.file) {
				try {
					await cloudinary.uploader.destroy(req.file.filename);
				} catch (err) {
					console.log(err);
				}
			}

			throw err;
		}
	};

let getAll =
	(Model: Model<any, any, any>, options?: FactoryQueryOptions) =>
	async (req: Request, res: Response, next: NextFunction) => {
		// // Allow nested routes
		// CURRENTLY COMMENTED OUT FOR REFACORING (add those id to query manually in route)
		if (options && options.allowNestedQueries) {
			for (const key of options.allowNestedQueries) {
				if (req.params[key]) {
					req.query[key] = req.params[key];
				}
			}
		}

		// Allow filtering by today's date
		// Loops through query string, find any key that has a value of "today"
		// and replace it with an object that specifies the range of today's date
		Object.keys(req.query).forEach((key) => {
			if (req.query[key] === "today") {
				// Filter orders by today's date
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const tomorrow = new Date(today);
				tomorrow.setDate(tomorrow.getDate() + 1);
				req.query[key] = {
					$gte: today.toISOString(),
					$lt: tomorrow.toISOString(),
				};
			}
		});

		// EXECUTE QUERY
		const features = new APIFeatures(Model.find(), req.query)
			.filter()
			.limitFields()
			.paginate()
			.sort();

		// Populate options
		if (options?.populate) {
			features.query.populate(options.populate);
		}

		// Added .lean() to improve performance
		const docs = await features.query.lean({ virtuals: true });
		const count = await Model.countDocuments(features.filterObj);

		// SEND RESPONSE
		// Set X-Total-Count header
		res.set("Access-Control-Expose-Headers", "X-Total-Count");
		res.set("X-Total-Count", count);
		res.ok(docs);
	};

let getOne =
	(Model: Model<any, any, any>, options?: FactoryQueryOptions) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const query = Model.findById(req.params.id).lean({ virtuals: true });

		if (options?.populate) {
			query.populate(options.populate);
		}

		const doc = await query;

		if (!doc) {
			throw new AppError(
				404,
				"NOT_FOUND",
				`Không tìm thấy ${Model.modelName.toLowerCase()} với ID ${
					req.params.id
				}`,
				{
					id: req.params.id,
					modelName: Model.modelName.toLowerCase(),
				}
			);
		}

		res.ok(doc);
	};

let updateOne =
	(Model: Model<any, any, any>, options?: FactoryQueryOptions) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const oldDoc = await Model.findById(req.params.id)
			.select("+imagePublicId")
			.lean({ virtuals: true });

		const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updatedDoc) {
			throw new AppError(
				404,
				"NOT_FOUND",
				`Không tìm thấy ${Model.modelName.toLowerCase()} với ID ${
					req.params.id
				}`,
				{
					id: req.params.id,
					modelName: Model.modelName.toLowerCase(),
				}
			);
		}

		if (
			oldDoc &&
			oldDoc.image &&
			oldDoc.image !== updatedDoc.image &&
			!(oldDoc.image.search("default") !== -1) // prevent deleting default image
		) {
			// Use cloudinary to delete old image
			await cloudinary.uploader.destroy(oldDoc.imagePublicId);
		}

		if (options?.populate) {
			await updatedDoc.populate(options.populate);
		}

		res.ok({
			data: updatedDoc,
		});
	};

let deleteOne =
	(Model: Model<any, any, any>) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const doc = await Model.findOneAndDelete({ _id: req.params.id }).select(
			"+imagePublicId"
		);

		if (!doc) {
			throw new AppError(
				404,
				"NOT_FOUND",
				`Không tìm thấy ${Model.modelName.toLowerCase()} với ID ${
					req.params.id
				}`,
				{
					id: req.params.id,
					modelName: Model.modelName.toLowerCase(),
				}
			);
		}

		if (
			doc.image &&
			!(doc.image.search("default") !== -1) // prevent deleting default image
		) {
			// Use cloudinary to delete old image
			try {
				await cloudinary.uploader.destroy(doc.imagePublicId);
			} catch (err) {
				console.log(err);
			}
		}

		res.noContent();
	};

export default { createOne, getAll, getOne, updateOne, deleteOne };
