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

router.get("/books", async (req, res) => {
  const { sort, category, q, limit = 10, page = 1 } = req.query;
  const findObj: {
    name?: { $regex: RegExp };
    category?: string;
  } = {};

  if (q) {
    findObj.name = { $regex: new RegExp(q.toString(), "i") };
  }

  if (category) {
    findObj.category = category.toString();
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
  };

  res.render("pages/books", {
    title: "Fohoso - Thế giới sách",
    categories,
    books,
    pagination,
    countBooks,
    q,
  });
});

export default router;
