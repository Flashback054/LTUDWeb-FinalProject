import * as zod from "zod";

export default zod.object({
	body: zod.object({
		user: zod.string({
			required_error: "Mã người dùng là bắt buộc",
			invalid_type_error: "Mã người dùng phải là chuỗi",
		}),
	}),
});
