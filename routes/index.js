import { Router } from "express";
import userRoutes from "./users.js";
// import menuItemRoutes from "./menuItems.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("welcome",  { user: req.session.user });
});

router.use("/auth", userRoutes);

export default router;