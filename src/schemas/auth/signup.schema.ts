import * as zod from "zod";

export default zod.object({
	body: zod.object({
		name: zod.string({
			required_error: "Phải nhập tên",
			invalid_type_error: "Tên không hợp lệ",
		}),
		email: zod
			.string({
				required_error: "Phải nhập email",
				invalid_type_error: "Email không hợp lệ",
			})
			.email({
				message: "Email không hợp lệ",
			}),
		password: zod
			.string({
				required_error: "Phải nhập mật khẩu",
			})
			.min(8, {
				message: "Mật khẩu phải có ít nhất 8 ký tự",
			}),
		passwordConfirm: zod
			.string({
				required_error: "Phải xác nhận mật khẩu",
			})
			.min(8, {
				message: "Mật khẩu xác nhận phải có ít nhất 8 ký tự",
			}),
	}),
});
