import * as zod from "zod";

const updateReviewSchema = zod.object({
	body: zod.object({
		rating: zod
			.number({
				required_error: "Đánh giá không được để trống",
				invalid_type_error: "Đánh giá phải là số",
			})
			.int({
				message: "Đánh giá phải là số nguyên",
			})
			.min(1, {
				message: "Đánh giá phải từ 1 đến 5",
			})
			.max(5, {
				message: "Đánh giá phải từ 1 đến 5",
			}),
		review: zod.string().optional(),
	}),
});

export default updateReviewSchema;
