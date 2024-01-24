import Book from "../models/book.model";
import { Request, Response, NextFunction } from "express";
import ControllerFactory from "../../commons/controllers/controller.factory";
import CloudinaryStorageFactory from "../../commons/configs/cloudinary.config";

const CloudinaryBookStorage = new CloudinaryStorageFactory(Book);
export const uploadBookImage = CloudinaryBookStorage.upload.single("image");

export const createBook = ControllerFactory.createOne(Book, {
	populate: {
		path: "category",
		select: "name image",
	},
});
export const getAllBooks = ControllerFactory.getAll(Book, {
	populate: {
		path: "category",
		select: "name image",
	},
});
export const getBook = ControllerFactory.getOne(Book, {
	populate: {
		path: "category",
		select: "name image",
	},
});
export const updateBook = ControllerFactory.updateOne(Book, {
	populate: {
		path: "category",
		select: "name image",
	},
});
export const deleteBook = ControllerFactory.deleteOne(Book);
export const getRecommendationBooks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const book = await Book.findById(req.params.id);

	let recommendedBooks = await Book.find(
		{_id: { $ne: book._id }, 
		category: book.category})
			.sort({ ratingsAverage: -1 })
			.limit(10)
			.lean();

	if (recommendedBooks.length === 0) {
		recommendedBooks = await Book.find({
			_id: { $ne: book._id }
		})
		.sort({ ratingsAverage: -1 })
		.limit(10)
		.lean();
	}

	res.ok({
		data: recommendedBooks
	});

};
