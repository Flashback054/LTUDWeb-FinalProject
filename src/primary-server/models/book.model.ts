import mongoose from "mongoose";
import { Types } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

interface IBook {
	id: Types.ObjectId;
	name: string;
	image?: string;
	imagePublicId?: string;
	purchasePrice: number;
	sellingPrice: number;
	author: string;
	publishedYear: number;
	ratingsAverage?: number;
	quantity?: number;
	description?: string;
	category: Types.ObjectId;
}

const bookSchema = new mongoose.Schema<IBook>(
	{
		name: {
			type: String,
			required: [true, "Hãy nhập tên sản phẩm"],
			unique: true,
		},
		image: {
			type: String,
		},
		imagePublicId: {
			type: String,
		},
		purchasePrice: {
			type: Number,
			required: [true, "Hãy nhập giá nhập sản phẩm"],
		},
		sellingPrice: {
			type: Number,
			required: [true, "Hãy nhập giá bán sản phẩm"],
		},
		author: {
			type: String,
			required: [true, "Hãy nhập tên tác giả"],
		},
		publishedYear: {
			type: Number,
			required: [true, "Hãy nhập năm xuất bản"],
			min: [0, "Năm xuất bản không hợp lệ"],
			validate: {
				validator: function (year: any) {
					return Number.isInteger(year);
				},
				message: "Năm xuất bản không hợp lệ",
			},
		},
		ratingsAverage: {
			type: Number,
			default: 5,
		},
		quantity: {
			type: Number,
			required: [true, "Hãy nhập số lượng sản phẩm"],
		},
		description: String,
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			// Set default category to 658be841b3eba6ae4c0e382b (id of category "Khác")
			default: "658be841b3eba6ae4c0e382b",
		},
	},
	{
		toJSON: { virtuals: true, versionKey: false },
	}
);

bookSchema.index({ name: 1 }, { unique: true });
bookSchema.plugin(mongooseLeanVirtuals);

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
