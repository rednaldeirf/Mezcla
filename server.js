import dotenv from "dotenv";
dotenv.config();
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";
import express from "express";
import mongoose from "mongoose";
import authController from "./controllers/auth.js";
import "./db/connection.js";
import menuItemRoutes from './routes/menuItems.js';
import path from "path";
import { fileURLToPath } from "url";
import indexRoutes from "./routes/index.js";
import isSignedIn from "./middleware/is-signed-in.js";
import userRoutes from "./routes/users.js";
import cartRoutes from './routes/cart.js';

const app = express();
const port = process.env.PORT ? process.env.PORT : "3000";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static("assets"));
app.use(methodOverride("_method"));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());

app.use('/', indexRoutes);
app.use ("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use('/menu', menuItemRoutes);

app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

// app.get("/vip-lounge", (req, res) => {
//   if (req.session.user) {
//     res.send(`Welcome to the party ${req.session.user.username}.`);
//   } else {
//     res.send("Sorry, no guests allowed.");
//   }
// });

app.use("/auth", authController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});