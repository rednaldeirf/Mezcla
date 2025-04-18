import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import isSignedIn from '../middleware/is-signed-in.js';

const router = express.Router();

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up");
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in");
});

router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.post("/sign-up", async (req, res) => {
  try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send("Username already taken.");
    }

    // Username is not taken already!
    // Check if the password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password must match");
    }

    // Must hash the password before sending to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    console.log(req.body)
    // All ready to create the new user!
    await User.create(req.body);

    res.redirect("/auth/sign-in");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send("Login failed. Please try again.");
    }

    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.send("Login failed. Please try again.");
    }

    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
    };

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});



router.delete('/delete', isSignedIn, async (req, res) => {
  const userId = req.session.user._id;

  try {
      await User.findByIdAndDelete(userId); // Delete user
      req.session.destroy(); // Destroy session
      res.redirect('/'); // Redirect after deletion
  } catch (error) {
      console.error("❌ Error deleting user:", error);
      res.status(500).send("Delete failed.");
  }
});
router.post('/delete', isSignedIn, async (req, res) => {
  const userId = req.session.user._id; // Get user ID from session

  try {
      await User.findByIdAndDelete(userId); // Delete user from database
      req.session.destroy(); // Destroy session
      res.redirect('/'); // Redirect to homepage after deletion
  } catch (error) {
      console.error("❌ Error deleting user:", error);
      res.status(500).send("Delete failed.");
  }
});
export default router;