import mongoose from "mongoose";

// const userSchema = mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },

// });
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    password: { type: String, required: true },
  });

const User = mongoose.model("User", userSchema);

export default User;