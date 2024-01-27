import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import AppError from "../../commons/utils/AppError";
import { createAccessToken } from "../../commons/utils/generateToken";
import User from "../models/user.model";
import { GoogleUser } from "../models/user.model";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, passwordConfirm } = req.body;

  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new AppError(400, "DUPLICATE_KEYS", "Email đã tồn tại.", { email });
  }

  // Check if password and passwordConfirm are the same
  if (password !== passwordConfirm) {
    throw new AppError(
      400,
      "INVALID_ARGUMENTS",
      "Mật khẩu nhập lại không khớp.",
      {
        passwordConfirm,
      }
    );
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  // Remove password from user object
  user.password = undefined;

  // Send request to create payment account
  await req.request.toPaymentServer("/api/v1/payment-accounts", {
    method: "POST",
    data: {
      user: user._id,
    },
  });

  const { accessToken, accessTokenOptions } = createAccessToken(user, req);

  res.cookie("accessToken", accessToken, accessTokenOptions);

  res.ok({
    accessToken: accessToken,
    data: user,
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }, "+password +active");

  if (user.authType === "google") {
    throw new AppError(
      401,
      "BAD_REQUEST",
      "Tài khoản này đã được đăng ký bằng Google. Vui lòng đăng nhập bằng Google."
    );
  }

  if (!user || !(await user.isCorrectPassword(password)))
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Email hoặc mật khẩu không đúng."
    );

  // 3) If everything ok, send tokens to client
  const { accessToken, accessTokenOptions } = createAccessToken(user, req);

  res.cookie("accessToken", accessToken, accessTokenOptions);

  res.ok({
    accessToken,
    userId: user._id,
  });
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  res.cookie("accessToken", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.ok({});
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;

  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.isCorrectPassword(oldPassword))) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Mật khẩu hiện tại không đúng."
    );
  }

  // 3) Check if new password and confirm password are the same
  if (newPassword !== newPasswordConfirm) {
    throw new AppError(
      400,
      "INVALID_ARGUMENTS",
      "Mật khẩu nhập lại không khớp.",
      {
        newPasswordConfirm,
      }
    );
  }

  // 3) If so, update password
  user.password = newPassword;
  await user.save();

  // 4) Log user in, send JWT
  const { accessToken, accessTokenOptions } = createAccessToken(user, req);

  res.cookie("accessToken", accessToken, accessTokenOptions);

  res.ok({
    accessToken,
  });
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1) Getting tokens
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  // If there is no accessToken, throw error
  if (!accessToken) {
    throw new AppError(
      401,
      "SESSION_EXPIRED",
      "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại."
    );
  }

  // 2) Verify Tokens
  let decoded;

  if (accessToken) {
    // 2.1) Verify accessToken
    try {
      decoded = await verifyToken(accessToken, process.env.ACCESS_SECRET);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new AppError(
          401,
          "SESSION_EXPIRED",
          "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại."
        );
      } else {
        throw new AppError(
          401,
          "INVALID_TOKENS",
          "Phiên đăng nhập có vấn đề. Vui lòng đăng nhập lại."
        );
      }
    }
  }

  // Check if decode is undefined
  if (!decoded) {
    throw new AppError(
      401,
      "INVALID_TOKENS",
      "Phiên đăng nhập có vấn đề. Vui lòng đăng nhập lại."
    );
  }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id)
    .select("+passwordUpdatedAt")
    .lean({ virtuals: true });

  if (!currentUser)
    throw new AppError(404, "NOT_FOUND", "Người dùng không tồn tại.");

  // 4) Check if user changed password after the token was issued
  if (isChangedPasswordAfter(currentUser.passwordUpdatedAt, decoded.iat))
    throw new AppError(
      401,
      "SESSION_EXPIRED",
      "Người dùng đã thay đổi mật khẩu. Vui lòng đăng nhập lại."
    );

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;

  return next();
};

export const restrictTo = (...roles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Admin have access to all routes
    if (req.user.role === "admin") return next();

    // roles ['admin', 'cashier', 'staff', 'customer']
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        403,
        "ACCESS_DENIED",
        "Người dùng không có quyền truy cập vào tài nguyên này."
      );
    }

    next();
  };
};

export const passwordConfirm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { passwordConfirm } = req.body;

  if (!passwordConfirm) {
    throw new AppError(400, "INVALID_ARGUMENTS", "Phải có mật khẩu xác nhận.", {
      passwordConfirm,
    });
  }

  const user = await User.findById(req.user.id).select("+password");
  const isCorrectPassword = await user.isCorrectPassword(passwordConfirm);

  if (!isCorrectPassword) {
    throw new AppError(
      400,
      "INVALID_CREDENTIALS",
      "Mật khẩu xác nhận không khớp.",
      {
        passwordConfirm,
      }
    );
  }

  next();
};

async function verifyToken(token: string, tokenSecret: string) {
  try {
    let decoded = jwt.verify(token, tokenSecret, (err, decoded) => {
      if (err) throw err;
      return decoded;
    });

    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw err;
    } else if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.NotBeforeError
    ) {
      throw new AppError(
        401,
        "INVALID_TOKENS",
        "Phiên đăng nhập có vấn đề. Vui lòng đăng nhập lại."
      );
    } else {
      throw err;
    }
  }
}

function isChangedPasswordAfter(passwordUpdatedAt: Date, JWTTimestamp: number) {
  // Password has been changed after user being created
  if (passwordUpdatedAt) {
    const passwordChangeTime = passwordUpdatedAt.getTime() / 1000;
    return JWTTimestamp < passwordChangeTime;
  }

  // False: token was issued before password change time
  return false;
}

// Google
export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1) Get google profile
  const user = req.user as unknown as GoogleUser;
  const profile = user._json;

  // 2) Check if googleId exists in database
  let existingUser = await User.findOne({
    $or: [{ googleId: profile.sub }, { email: profile.email }],
  });

  // 3) If user not exists, create new user
  if (!existingUser) {
    existingUser = await User.create({
      googleId: profile.sub,
      authType: "google",
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      imagePublicId: undefined,
    });

    // Send request to create payment account
    await req.request.toPaymentServer("/api/v1/payment-accounts", {
      method: "POST",
      data: {
        user: existingUser._id,
      },
    });
  }

  const { accessToken, accessTokenOptions } = createAccessToken(
    existingUser,
    req
  );

  res.cookie("accessToken", accessToken, accessTokenOptions);

  // res.ok({
  // 	accessToken,
  // 	userId: existingUser._id,
  // });

  res.redirect("/");
};
