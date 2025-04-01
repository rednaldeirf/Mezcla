import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    //is_vegetarian: Boolean
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;