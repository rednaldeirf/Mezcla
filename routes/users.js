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
      res.redirect("/auth/sign-in");
    } catch (error) {
      console.log(error);
      res.redirect("/menu/profile");
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
        address: user.address,
        email: user.email,
      };
  
      req.session.welcomeMessage = `Welcome back, ${user.username}!`;
      res.redirect("/menu");
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
//   router.get("/profile", isSignedIn, (req, res) => {
//     res.render("users/profile", { user: req.session.user });
//   });
router.get("/profile", (req, res) => {
    const user = req.session.user;
    if (!user) return res.redirect("/auth/sign-in");
  
    res.render("profile", { user });
  });

  //edit user
  router.get("/edit", (req, res) => {
    const user = req.session.user;
    if (!user) return res.redirect("/auth/sign-in");
  
    res.render("auth/edit", { user });
  });

  router.post("/edit", isSignedIn, async (req, res) => {
    const userId = req.session.user._id;
    // ...
  });
  
  router.post("/edit", async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/users/sign-in");
    }
  
    const userId = req.session.user._id;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          email: req.body.email,
          address: req.body.address,
          phone: req.body.phone,
        },
        { new: true }
      );
  
      req.session.user = {
        ...req.session.user,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
      };
  
      console.log("✅ User updated:", updatedUser);
  
      // ✅ Ensure session is saved before redirecting
      req.session.save(() => {
        res.redirect("/users/profile");
      });
    } catch (error) {
      console.error("❌ Error updating user:", error);
      res.status(500).send("Update failed.");
    }
  });
//   router.post("/edit", async (req, res) => {
//     if (!req.session.user) {
//         console.log("⛔️ No user session");
//         return res.redirect("/auth/sign-in");
//       }

//       console.log("🧾 Form submission received:", req.body);
    
//     const userId = req.session.user._id;
  
//     try {
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         {
//           email: req.body.email,
//           address: req.body.address,
//           phone: req.body.phone
//         },
//         { new: true }
//       );

//       console.log("✅ User updated:", updatedUser);
  
//       // Update session user info
//       req.session.user = {
//         ...req.session.user,
//         email: updatedUser.email,
//         address: updatedUser.address,
//         phone: updatedUser.phone
//       };

//       console.log("✅ User updated:", updatedUser);
  
//       res.redirect("/profile");
//     } catch (error) {
//       console.log("Error updating user:", error);
//       res.redirect("/auth/edit");
//     }
//   });

export default router;
        
            