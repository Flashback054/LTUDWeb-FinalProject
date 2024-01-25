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
  const { sort, limit = 10, page = 1 } = req.query;

  const query = Book.find({});

  if (sort) {
    query.sort({
      [sort.toString().replace("-", "")]: sort.toString().includes("-")
        ? -1
        : 1,
    });
  }

  const [categories, books] = await Promise.all([
    Category.find({}).lean(),
    query
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .lean(),
  ]);

  res.render("pages/books", {
    title: "Fohoso - Thế giới sách",
    categories,
    books,
  });
});

export default router;
