import { Router } from "express";
import MenuItem from "../models/menuItem.js";
import { getCartForUser } from '../controllers/cartController.js';
import { addItemToCart } from '../controllers/cartController.js'; // Adjust path as necessary

const router = Router();

router.post("/add-to-cart", async (req, res) => {
  const { userId, menuItemId } = req.body; // Expect userId and menuItemId to be provided in the request body
  try {
      await addItemToCart(userId, menuItemId, quantity); // Call your add item function from the controller
      res.status(200).send('Item added to cart'); // Respond with success
  } catch (error) {
      console.error("Failed to add item to cart:", error);
      res.status(500).send('Failed to add item to cart'); // Handle any errors
  }
});

router.get("/", async (req, res) => {
  const userId = req.session.user?._id;
  let cartItems = [];

  if (userId) {
    const user = await getCartForUser(userId); // make sure it returns populated cart
    cartItems = user?.cart?.items || [];
  }
  if (userId) {
    const userWithCart = await getCartForUser(userId); // this should return the populated cart
    cartItems = userWithCart?.cart?.items || [];
  }

  res.render("cart/index", { 
    cart: cartItems,
    user: req.session.user
  });
});

// Route to view the cart
// router.get("/", (req, res) => {
//   const cart = req.session.cart || [];
//   const user = req.session.user || null;

//   console.log("🧠 user in session:", req.session.user);
//   res.render("cart/index", { 
//       cart, 
//       user 
//   }); // Render the cart view with the user's cart
// });



// Update cart (quantity + remove)
router.post("/update", (req, res) => {
  const { ids = [], quantities = [], remove = [] } = req.body;

  if (!req.session.cart) return res.redirect("/cart");

  const normalizedIds = Array.isArray(ids) ? ids : [ids];
  const normalizedQuantities = Array.isArray(quantities) ? quantities : [quantities];
  const removeList = Array.isArray(remove) ? remove : remove ? [remove] : [];

  const updatedCart = [];

  normalizedIds.forEach((id, i) => {
    if (removeList.includes(id)) return;

    const quantity = parseInt(normalizedQuantities[i]);
    if (quantity > 0) {
      const item = req.session.cart.find(it => it.id === id);
      if (item) {
        updatedCart.push({ ...item, quantity });
      }
    }
  });

  req.session.cart = updatedCart;
  res.redirect("/cart");
});

// 🚨 Was nested — now correctly placed
router.post("/add/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.redirect("/menu");

    if (!req.session.cart) req.session.cart = [];

    const itemId = item._id.toString();
    const existingItem = req.session.cart.find(i => i.id === itemId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      req.session.cart.push({
        id: itemId,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    }

    req.session.save(() => {
      res.redirect("/menu");
    });
  } catch (error) {
    console.error("🛑 Error adding item to cart:", error);
    res.status(500).send("Error adding to cart.");
  }
});

// Ajax version
async function addToCart(userId, menuItemId) {
  const response = await fetch('/cart/add-to-cart', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, menuItemId, quantity: 1 }) // Sending JSON body
  });

  if (response.ok) {
      const message = await response.text(); // Get the success message
      console.log(message); // Output the success message
  } else {
      console.error('Failed to add item to cart.');
  }
}
router.post("/ajax/add/:id", async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false });

  if (!req.session.cart) req.session.cart = [];

  const existingItem = req.session.cart.find(i => i.id === item._id.toString());
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    req.session.cart.push({
      id: item._id.toString(),
      name: item.name,
      price: item.price,
      quantity: 1
    });
  }

  const cartCount = req.session.cart.reduce((sum, i) => sum + i.quantity, 0);
  res.json({ success: true, cartCount });
});



// 🛒 Cart view
router.get("/", (req, res) => {
  const cart = req.session.cart || [];
  const user = req.session.user || null;

  console.log("🧠 user in session:", req.session.user);
  res.render("cart/index", {
    cart,
    user,
  });
});

// Checkout handler
router.post("/checkout", (req, res) => {
  const { orderType, editAddress, newAddress } = req.body;

  if (orderType === "delivery") {
    if (editAddress && newAddress) {
      req.session.deliveryAddress = newAddress;
    } else if (req.session.user?.address) {
      req.session.deliveryAddress = req.session.user.address;
    } else {
      return res.send("No address provided.");
    }
  }

  req.session.orderType = orderType;
  res.redirect("/cart/confirm");
});

router.get("/confirm", (req, res) => {
    const user = req.session.user || null;
    const orderType = req.session.orderType || "pickup";
    const deliveryAddress = req.session.deliveryAddress || null;
    const cart = req.session.cart || [];
  
    res.render("cart/confirm", {
      cart,
      user,
      orderType,
      deliveryAddress
    });
  });

  router.get('/:userId/cart', async (req, res) => {
    try {
        const cart = await getCartForUser(req.params.userId); // Use the function to fetch cart for user
        res.status(200).json(cart); // Respond with cart data
    } catch (error) {
        res.status(500).send("Error retrieving cart"); // Error handling
    }
});

router.post('/add-to-cart', async (req, res) => {
  const { userId, menuItemId, quantity = 1 } = req.body; // Make sure to send userId and menuItemId in the request body
  try {
      await addItemToCart(userId, menuItemId); // Call your add item function
      res.status(200).send('Item added to cart');
  } catch (error) {
      res.status(500).send('Failed to add item to cart');
  }
});



export default router;
