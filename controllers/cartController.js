
import User from '../models/user.js'; // Ensure you import the User model
import Cart from '../models/cart.js'; // If you have a Cart model


const addItemToCart = async (userId, menuItemId, quantity = 1) => {
    try {
        // Find the user
        const user = await User.findById(userId);

        if (!user) {
            console.error("User not found");
            return; 
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create a new cart if there isn't one already
            cart = new Cart({ user: userId, items: [] });
        }

        // Find or create a cart for the user
        // let cart = user.cart ? await Cart.findById(user.cart) : new Cart({ user: userId });

        // Check if item is already in the cart
        const existingItem = cart.items.find(item => item.menuItem.toString() === menuItemId);
        
        if (existingItem) {
            // If it exists, update the quantity
            existingItem.quantity += quantity;
        } else {
            // If it doesn't exist, add new item
            cart.items.push({ menuItem: menuItemId, quantity });
        }

        await cart.save(); // Save the cart
        user.cart = cart._id; // Link the cart to the user
        await user.save(); // Save user with updated cart reference

        console.log("Item added to cart successfully");
    } catch (error) {
        console.error("Error adding item to cart:", error);
    }
};


const getCartForUser = async (userId) => {
    try {
        const user = await User.findById(userId).populate({
            path: 'cart',
            populate: { 
                path: 'items.menuItem' 
            }
        });
        return user;
    } catch (error) {
        console.error("Error retrieving user cart:", error);
        return null;
    }
  };
// const getCartForUser = async (userId) => {
//     try {
//         const user = await User.findById(userId).populate('cart').exec();
//         console.log(user.cart); // This will include the cart with items if populated correctly
//     } catch (error) {
//         console.error("Error retrieving user cart:", error);
//     }
// };

export { 
    getCartForUser, 
    addItemToCart
};