import Book from "../models/book.model";
import { Request, Response, NextFunction } from "express";
import ControllerFactory from "./controller.factory";
import CloudinaryStorageFactory from "../configs/cloudinary.config";

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
