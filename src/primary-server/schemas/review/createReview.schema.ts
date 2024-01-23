import * as zod from "zod";
import mongoose from "mongoose";

const reviewSchema = zod.object({
	user: zod
		.string({
			required_error: "Phải có id người dùng",
		})
		.superRefine((val, ctx) => {
			if (!mongoose.isValidObjectId(val)) {
				ctx.addIssue({
					code: zod.ZodIssueCode.invalid_arguments,
					message: `${val} không phải là ID người dùng hợp lệ`,
					argumentsError: new zod.ZodError([]), // Add the missing argumentsError property
				});
			}
		})
		.optional(),
	book: zod
		.string({
			required_error: "Phải có id sản phẩm",
		})
		.superRefine((val, ctx) => {
			if (!mongoose.isValidObjectId(val)) {
				ctx.addIssue({
					code: zod.ZodIssueCode.invalid_arguments,
					message: `${val} không phải là ID sản phẩm hợp lệ`,
					argumentsError: new zod.ZodError([]), // Add the missing argumentsError property
				});
			}
		}),
	rating: zod
		.number({
			required_error: "Phải có rating là số",
		})
		.int({
			message: "Rating phải là số nguyên",
		})
		.min(1, {
			message: "Rating phải từ 1 đến 5",
		})
		.max(5, {
			message: "Rating phải từ 1 đến 5",
		}),
	review: zod.string().optional(),
	createdAt: zod.date().optional(),
	updatedAt: zod.date().optional(),
});

const createReviewSchema = zod.object({
	body: zod.union([reviewSchema, zod.array(reviewSchema)]),
});

export default createReviewSchema;
