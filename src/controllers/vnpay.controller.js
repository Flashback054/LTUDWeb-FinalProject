let querystring = require("qs");
let crypto = require("crypto");
const moment = require("moment");

const User = require("../models/user.model");
const Book = require("../models/book.model");
const Order = require("../models/order.model");
const AppError = require("../utils/AppError");
const Payment = require("../models/payment.model");

exports.createVNPAYPayment = async (req, res, next) => {
	// Get order
	const order =
		req.order || (await Order.findById(req.params.id).lean({ virtuals: true }));

	let payment = await Payment.findOne({ order: order._id }).lean({
		virtuals: true,
	});

	// If payment is not found, create a new one
	if (!payment) {
		payment = await Payment.create({
			order: order._id,
			paymentDescription: `Thanh toán đơn hàng ${order._id}`,
			totalPrice: order.totalPrice,
			finalPrice: order.finalPrice,
		});
	}

	// If payment is found and status is success, throw an error
	if (payment?.status === "success") {
		throw new AppError(
			400,
			"DUPLICATE_TRANSACTION",
			"Thanh toán cho đơn hàng này đã được thực hiện trước đó."
		);
	}

	// If payment is found and statis is either "pending" or "failed", attempt to init a new VNPAY transaction
	process.env.TZ = "Asia/Ho_Chi_Minh";

	let date = new Date();
	// Format date as "YYYYMMDDHHmmss"
	let createDate = moment(date).format("YYYYMMDDHHmmss");

	let ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

	let tmnCode = process.env.vnp_TmnCode;
	let secretKey = process.env.vnp_HashSecret;
	let vnpUrl = process.env.vnp_Url;
	let returnUrl = process.env.vnp_ReturnUrl;
	// let ipnUrl = process.env.vnp_IpnUrl;
	let paymentId = payment.id;
	let amount = payment.finalPrice;
	// let bankCode = req.body.bankCode;
	let bankCode = null;
	let locale = "vn";
	let currCode = "VND";
	let vnp_Params = {};
	vnp_Params["vnp_Version"] = "2.1.0";
	vnp_Params["vnp_Command"] = "pay";
	vnp_Params["vnp_TmnCode"] = tmnCode;
	vnp_Params["vnp_Locale"] = locale;
	vnp_Params["vnp_CurrCode"] = currCode;
	vnp_Params["vnp_TxnRef"] = paymentId;
	vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + paymentId;
	vnp_Params["vnp_OrderType"] = "other";
	vnp_Params["vnp_Amount"] = amount * 100;
	vnp_Params["vnp_ReturnUrl"] = returnUrl;
	// vnp_Params["vnp_IpnURL"] = ipnUrl;
	vnp_Params["vnp_IpAddr"] = ipAddr;
	vnp_Params["vnp_CreateDate"] = createDate;
	if (bankCode !== null && bankCode !== "") {
		vnp_Params["vnp_BankCode"] = bankCode;
	}

	vnp_Params = sortObject(vnp_Params);

	let signData = querystring.stringify(vnp_Params, { encode: false });
	let hmac = crypto.createHmac("sha512", secretKey);
	let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
	vnp_Params["vnp_SecureHash"] = signed;
	vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

	// Redirecting with CSP headers is not allowed, return a 200 response with the redirect URL instead
	res.status(200).json({
		data: vnpUrl,
	});
};

exports.vnpayReturn = async (req, res, next) => {
	let vnp_Params = req.query;
	let secureHash = vnp_Params["vnp_SecureHash"];

	let paymentId = vnp_Params["vnp_TxnRef"];
	let rspCode = vnp_Params["vnp_ResponseCode"];

	delete vnp_Params["vnp_SecureHash"];
	delete vnp_Params["vnp_SecureHashType"];

	vnp_Params = sortObject(vnp_Params);
	let secretKey = process.env.vnp_HashSecret;
	let signData = querystring.stringify(vnp_Params, { encode: false });
	let hmac = crypto.createHmac("sha512", secretKey);
	let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

	const payment = await Payment.findById(paymentId);

	let checkPaymentId = !!payment; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
	let checkAmount = payment.finalPrice === vnp_Params.vnp_Amount / 100; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn

	// 3 belows conditions are never met if using the exact vnpUrl provided by backend.
	// Just in case, I still keep them here.
	if (secureHash !== signed) {
		throw new AppError(400, "INVALID_ARGUMENTS", "Invalid signature");
	}

	if (!checkPaymentId) {
		throw new AppError(400, "INVALID_ARGUMENTS", "Invalid payment ID");
	}

	if (!checkAmount) {
		throw new AppError(400, "INVALID_ARGUMENTS", "Invalid amount");
	}

	if (payment.status === "success") {
		throw new AppError(
			400,
			"DUPLICATE_TRANSACTION",
			"Thanh toán nạp tiền đã được thực hiện trước đó.",
			{
				payment,
			}
		);
	}

	// Thanh toán thành công
	if (rspCode === "00") {
		// Cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
		payment.status = "success";
		payment.paymentDate = Date.now();
		await payment.save();

		// Update order status to "paid"
		const paidOrder = await Order.findByIdAndUpdate(
			payment.order,
			{ status: "paid" },
			{ new: true }
		);

		res.status(200).redirect("http://localhost:5173/customer/deposit");
	} else {
		// Thanh toán thất bại. Kiểm tra rspCode để biết lý do thất bại

		let errMessage;
		switch (rspCode) {
			case "09":
				errMessage = `Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.`;
				break;
			case "10":
				errMessage = `Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần`;
				break;
			case "11":
				errMessage = `Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.`;
				break;
			case "12":
				errMessage = `Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.`;
				break;
			case "13":
				errMessage = `Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.`;
				break;
			case "24":
				errMessage = `Giao dịch không thành công do: Khách hàng hủy giao dịch`;
				break;
			case "51":
				errMessage = `Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.`;
				break;
			case "65":
				errMessage = `Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.`;
				break;
			case "79":
				errMessage = `	Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch.`;
				break;

			default:
				errMessage = `Giao dịch không thành công do: Lỗi không xác định.`;
				break;
		}

		// Cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
		payment.status = "failed";
		payment.paymentError = errMessage;
		await payment.save();

		res.status(200).redirect("http://localhost:5173/customer/deposit");
	}
};

// Sort OBJ function provided by VNPAY
function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			str.push(encodeURIComponent(key));
		}
	}
	str.sort();
	for (key = 0; key < str.length; key++) {
		sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
	}
	return sorted;
}
