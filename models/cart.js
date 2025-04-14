import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true // Required for linking a cart to a user
    },
    items: [{
        menuItem: { 
            type: mongoose.Schema.Types.ObjectId, // Reference to the MenuItem model
            ref: 'MenuItem',
            required: true
        },
        quantity: { // Number of each menu item in the cart
            type: Number,
            default: 1 // Default quantity is 1
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;