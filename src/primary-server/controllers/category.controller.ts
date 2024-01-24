import { Request, Response, NextFunction } from "express";
import Category from "../models/category.model";
import ControllerFactory from "../../commons/controllers/controller.factory";
const CloudinaryStorageFactory = require("../../commons/configs/cloudinary.config");

const CloudinaryCategoryStorage = new CloudinaryStorageFactory(Category);

export const uploadCategoryImage =
	CloudinaryCategoryStorage.upload.single("image");

export const getAllCategories = ControllerFactory.getAll(Category);
export const getCategory = ControllerFactory.getOne(Category);
export const createCategory = ControllerFactory.createOne(Category);
export const updateCategory = ControllerFactory.updateOne(Category);
export const deleteCategory = ControllerFactory.deleteOne(Category);
