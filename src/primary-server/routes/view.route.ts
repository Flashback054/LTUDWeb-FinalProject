import { Router } from "express";
import { createAccessToken } from "../../commons/utils/generateToken";
import Book from "../models/book.model";
import Category from "../models/category.model";
import User from "../models/user.model";
import axios from "axios";

import jwt from "jsonwebtoken";

const serverAuthSecret = process.env.SERVER_AUTH_SECRET;
const serverAuthPayload = process.env.SERVER_AUTH_PAYLOAD;

const paymentServerInstance = axios.create({
  baseURL: process.env.PAYMENT_SERVER_URL,
});

paymentServerInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = jwt.sign(
      {
        name: serverAuthPayload,
      },
      serverAuthSecret,
      {
        expiresIn: "1m",
      }
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function injectUser(req, res, next) {
  const { accessToken } = req.cookies;

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET) as {
        id: string;
      };
      const user = await User.findById(decoded.id).lean({ virtuals: true });
      const [paymentAccount] = await req.request.toPaymentServer(
        `/api/v1/payment-accounts?user=${decoded.id}`,
        {
          method: "GET",
        }
      );
      res.locals.user = user;
      req.user = user;
      req.paymentAccount = paymentAccount;
      res.locals.paymentAccount = paymentAccount;
    } catch (error) {
      res.locals.user = null;
      req.user = null;

      console.log(error);
    }
  }

  next();
}

function redirectIfLoggedIn(req, res, next) {
  const { accessToken } = req.cookies;

  if (accessToken) {
    return res.redirect("/");
  }

  next();
}

const router = Router();

router.use(injectUser);

router.get("/", async (req, res) => {
  const [top5HighRatedBooks, top5RecentlyAddedBooks, bookCategories] =
    await Promise.all([
      Book.find({}).sort({ rating: -1, name: -1 }).limit(5).lean(),
      Book.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Category.find({}).lean(),
    ]);

  res.render("pages/home", {
    title: "Fohoso - Hiệu sách của bạn",
    top5HighRatedBooks,
    top5RecentlyAddedBooks,
    bookCategories,
  });
});

const priceRangeMap = {
  "0-50": {
    min: 0,
    max: 50,
  },
  "50-100": {
    min: 50,
    max: 100,
  },
  "100-200": {
    min: 100,
    max: 200,
  },
  "200-500": {
    min: 200,
    max: 500,
  },
  "500-": {
    min: 500,
    max: Infinity,
  },
};

const ratingRangeMap = {
  "0-2": {
    min: 0,
    max: 2,
  },
  "2-4": {
    min: 2,
    max: 4,
  },
  "4-": {
    min: 4,
    max: 5,
  },
};

router.get("/books", async (req, res) => {
  const {
    sort,
    category,
    q,
    limit = 10,
    page = 1,
    priceRange,
    rating,
  } = req.query;
  const findObj: {
    name?: { $regex: RegExp };
    category?: string;
    sellingPrice?: { $gte: number; $lte: number };
    ratingsAverage?: { $gte: number; $lte: number };
  } = {};

  if (q) {
    findObj.name = { $regex: new RegExp(q.toString(), "i") };
  }

  if (category) {
    findObj.category = category.toString();
  }

  if (priceRange && priceRange != "all") {
    const { min, max } = priceRangeMap[priceRange.toString()];
    findObj.sellingPrice = { $gte: min * 1_000, $lte: max * 1_000 };
  }

  if (rating && rating != "all") {
    const { min, max } = ratingRangeMap[rating.toString()];
    findObj.ratingsAverage = { $gte: min, $lte: max };
  }

  const query = Book.find(findObj);

  if (sort) {
    query.sort({
      [sort.toString().replace("-", "")]: sort.toString().includes("-")
        ? -1
        : 1,
    });
  }

  const [categories, books, countBooks] = await Promise.all([
    Category.find({}).lean(),
    query
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .lean(),
    Book.countDocuments(findObj),
  ]);

  const totalPages = Math.ceil(countBooks / +limit);
  const currentPage = +page;
  const currentUrl = req.originalUrl.toString().replace(/[&?]page=\d+/, "");

  if (currentUrl.includes("?")) {
    currentUrl.concat("&");
  } else {
    currentUrl.concat("?");
  }

  const pagination = {
    currentPage,
    prevPage: currentPage > 1 ? currentPage - 1 : 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : totalPages,
    hasNextPage: currentPage < totalPages ? "true" : "false",
    hasPrevPage: currentPage > 1 ? "true" : "false",
    pageList: [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ].filter((page) => page > 0 && page <= totalPages),
    currentUrl,
    hasPagination: totalPages > 1,
  };

  res.render("pages/books/index", {
    title: "Fohoso - Thế giới sách",
    categories,
    books,
    pagination,
    countBooks,
    q,
  });
});

router.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id).populate("category").lean();

  const recommendedBooks = await Book.find({
    $and: [
      { _id: { $ne: id } },
      {
        $or: [
          { category: book.category._id },
          { author: book.author },
          { ratingsAverage: { $gte: 3 } },
        ],
      },
    ],
  })
    .sort({ rating: -1 })
    .limit(10)
    .lean();

  res.render("pages/books/show", {
    title: book.name,
    book,
    recommendedBooks,
  });
});

router.get("/cart", async (req, res) => {
  const userId = req.user?.id;

  const [chargeHistories, orderHistories] = await Promise.all([
    req.request.toPaymentServer(`/api/v1/charge-histories?user=${userId}`),
    req.request.toPaymentServer(`/api/v1/payments?user=${userId}`),
  ]);

  console.log(orderHistories.at(0).order);

  res.render("pages/cart", {
    title: "Fohoso - Giỏ hàng",
    chargeHistories,
    orderHistories,
  });
});

router.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("pages/login", {
    title: "Fohoso - Đăng nhập",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const locals = {
    title: "Fohoso - Đăng nhập",
    old: { email },
  };

  const user = await User.findOne({ email }, "+password +active");

  if (user.authType === "google") {
    return res.render("pages/login", {
      ...locals,
      errorMessage:
        "Tài khoản này đã được đăng ký bằng Google. Vui lòng đăng nhập bằng Google.",
    });
  }

  if (!user || !(await user.isCorrectPassword(password))) {
    return res.render("pages/login", {
      ...locals,
      errorMessage: "Email hoặc mật khẩu không đúng.",
    });
  }

  const { accessToken, accessTokenOptions } = createAccessToken(user, req);

  res.cookie("accessToken", accessToken, accessTokenOptions);

  res.redirect("/");
});

router.get("/register", redirectIfLoggedIn, (req, res) => {
  res.render("pages/register", {
    title: "Fohoso - Đăng ký",
  });
});

router.post("/register", async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const locals = {
    title: "Fohoso - Đăng ký",
    old: { name, email },
  };

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.render("pages/register", {
      ...locals,
      errorMessage: "Email đã được đăng ký.",
    });
  }

  if (password !== passwordConfirm) {
    return res.render("pages/register", {
      ...locals,
      errorMessage: "Mật khẩu không khớp.",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  user.password = undefined;

  try {
    await paymentServerInstance.post("/api/v1/payment-accounts", {
      user: user._id,
    });
  } catch (error) {
    console.log(error);
  }

  const { accessToken, accessTokenOptions } = createAccessToken(user, req);

  res.cookie("accessToken", accessToken, accessTokenOptions);

  res.render("pages/login", {
    title: "Fohoso - Đăng nhập",
    successMessage: "Đăng ký thành công. Vui lòng đăng nhập.",
    old: { email },
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.redirect("/");
});

router.get("*", (req, res) => {
  res.render("pages/404", {
    title: "Fohoso - 404",
    layout: "error",
  });
});

export default router;
