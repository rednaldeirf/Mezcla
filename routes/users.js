import { Router } from "express";
import isSignedIn from "../middleware/is-signed-in.js";
// import * as controllers from "../controllers/auth.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";


const router = Router();

// router.get("/sign-up", controllers.getSignUp);
// router.get("/sign-in", controllers.getSignIn);
// router.post("/sign-up", controllers.registerUser);
// router.post("/sign-in", controllers.loginUser);
// router.get("/sign-out", controllers.signOutUser);
// router.get("/vip", isSignedIn, controllers.enterVIP);
// router.get('/profile', isSignedIn, (req, res) => {
//     res.render('users/profile', { user: req.session.user });
//   });

// Sign-up form
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
  });
  
  // Sign-in form
  router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
  });
  
  // Sign-up submission
  router.post("/sign-up", async (req, res) => {
    try {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.send("Username already taken.");
      }
  
      if (req.body.password !== req.body.confirmPassword) {
        return res.send("Passwords must match.");
      }
  
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      req.body.password = hashedPassword;
  
      await User.create(req.body);
      res.redirect("/users/sign-in");
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  });
  
  // Sign-in submission
  router.post("/sign-in", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.send("Login failed.");
      }
  
      const validPassword = bcrypt.compareSync(req.body.password, user.password);
      if (!validPassword) {
        return res.send("Login failed.");
      }
  
      req.session.user = {
        username: user.username,
        _id: user._id,
      };
  
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  });
  
  // Sign-out
  router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });
  
  // Profile page
  router.get("/profile", isSignedIn, (req, res) => {
    res.render("users/profile", { user: req.session.user });
  });

export default router;