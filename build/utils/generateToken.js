"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = exports.signToken = void 0;
var jwt = __importStar(require("jsonwebtoken"));
function signToken(id, secret, expires) {
    return jwt.sign({ id: id }, secret, {
        expiresIn: expires,
    });
}
exports.signToken = signToken;
function createAccessToken(user, req) {
    var accessToken = signToken(user._id, process.env.ACCESS_SECRET, process.env.ACCESS_EXPIRES_IN);
    var accessTokenOptions = {
        expires: new Date(
        // valid for 1 day
        Date.now() + +process.env.ACCESS_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
    };
    if (req.secure || req.headers["x-forwarded-proto"] === "https") {
        accessTokenOptions.secure = true;
    }
    return { accessToken: accessToken, accessTokenOptions: accessTokenOptions };
}
exports.createAccessToken = createAccessToken;
// exports.createRefreshToken = (user, req) => {
// 	const refreshToken = signToken(
// 		user._id,
// 		process.env.REFRESH_SECRET,
// 		process.env.REFRESH_EXPIRES_IN
// 	);
// 	const refreshTokenOptions = {
// 		expires: new Date(
// 			// valid for 1 day
// 			Date.now() + process.env.REFRESH_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
// 		),
// 		httpOnly: true,
// 	};
// 	if (req.secure || req.headers["x-forwarded-proto"] === "https") {
// 		refreshTokenOptions.secure = true;
// 	}
// 	return { refreshToken, refreshTokenOptions };
// };
//# sourceMappingURL=generateToken.js.map