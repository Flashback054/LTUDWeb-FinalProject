import { Router } from "express";
import Book from "../models/book.model";
import Category from "../models/category.model";

const router = Router();

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

router.get("/cart", (req, res) => {
  res.render("pages/cart", {
    title: "Fohoso - Giỏ hàng",
  });
});

export default router;
