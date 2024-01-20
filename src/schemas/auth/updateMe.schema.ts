import * as zod from "zod";

export default zod.object({
	body: zod.object({
		name: zod.string().optional(),
		phone: zod
			.string()
			.min(10, {
				message: "Số điện thoại phải có 10 chữ số.",
			})
			.max(10, {
				message: "Số điện thoại phải có 10 chữ số.",
			})
			.optional(),
		image: zod.string().optional(),
	}),
});
