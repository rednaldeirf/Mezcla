import { Router } from "express";
import userRoutes from "./users.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.use("/auth", userRoutes);

export default router;