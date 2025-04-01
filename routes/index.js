import { Router } from "express";
import userRoutes from "./users.js";
import menuItemRoutes from "./menuItems.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.use("/auth", userRoutes);

export default router;