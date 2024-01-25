import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("pages/home", { title: "Fohoso - Hiệu sách của bạn" });
});

export default router;
