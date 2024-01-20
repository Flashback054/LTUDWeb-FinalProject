import mongoose, { Types } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import Book from "./book.model";

interface IReview {
	id: Types.ObjectId;
	user: mongoose.Types.ObjectId;
	book: mongoose.Types.ObjectId;
	rating: number;
	review?: string;
	image?: string;
	imagePublicId?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface IReviewModel extends mongoose.Model<IReview> {
	calcAverageRatings(book: mongoose.Types.ObjectId): Promise<void>;
}

const reviewSchema = new mongoose.Schema<IReview, IReviewModel>({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, "Hãy nhập id người dùng"],
	},
	book: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Book",
		required: [true, "Hãy nhập id sách"],
	},
	rating: {
		type: Number,
		min: [1, "Đánh giá phải từ 1 đến 5"],
		max: [5, "Đánh giá phải từ 1 đến 5"],
		required: [true, "Hãy nhập đánh giá"],
	},
	review: String,
	image: String,
	imagePublicId: String,
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
	},
});

reviewSchema.index({ book: 1, user: 1 }, { unique: true });

reviewSchema.pre("save", function (next) {
	if (!this.isNew) {
		this.updatedAt = new Date();
	}
	next();
});

reviewSchema.statics.calcAverageRatings = async function (book) {
	const stats = await this.aggregate([
		{
			$match: { book },
		},
		{
			$group: {
				_id: "$book",
				nRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);

	if (stats.length > 0) {
		await Book.findByIdAndUpdate(book, {
			ratingsAverage: stats[0].avgRating,
		});
	} else {
		await Book.findByIdAndUpdate(book, {
			ratingsAverage: 5,
		});
	}
};

reviewSchema.post("save", async function (doc, next) {
	await (doc.constructor as any).calcAverageRatings(doc.book);
	next();
});

reviewSchema.post(/^findOneAnd/, async function (doc, next) {
	await doc.constructor.calcAverageRatings(doc.book);
	next();
});

reviewSchema.plugin(mongooseLeanVirtuals);

const Review = mongoose.model<IReview, IReviewModel>("Review", reviewSchema);

export default Review;
