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

router.get("/books", (req, res) => {
  res.render("pages/books", { title: "Fohoso - Thế giới sách" });
});

export default router;
