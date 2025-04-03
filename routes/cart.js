import { Router } from "express";
import MenuItem from "../models/menuItem.js";

const router = Router();

// router.post("/add/:id", async (req, res) => {
//   const item = await MenuItem.findById(req.params.id);
//   if (!item) return res.redirect("/menu");

//   if (!req.session.cart) req.session.cart = [];

//   if (existingItem) {
//     existingItem.quantity += 1;
//   } else {
//     req.session.cart.push({
//       id: item._id.toString(),
//       name: item.name,
//       price: item.price,
//       quantity: 1,
//     });
//   }

// //   req.session.cart.push({
// //     id: item._id,
// //     name: item.name,
// //     price: item.price,
// //   });

//   res.redirect("/menu");
// });

// router.get("/", (req, res) => {
//   const cart = req.session.cart || [];
//   res.render("cart/index", { cart });
// });

router.post("/update", (req, res) => {
    const { ids = [], quantities = [], remove = [] } = req.body;

    if (!req.session.cart) return res.redirect("/cart");
  
    // Normalize all incoming fields
    const normalizedIds = Array.isArray(ids) ? ids : [ids];
    const normalizedQuantities = Array.isArray(quantities) ? quantities : [quantities];
    const removeList = Array.isArray(remove) ? remove : remove ? [remove] : [];
  
    const updatedCart = [];
  
    normalizedIds.forEach((id, i) => {
      if (removeList.includes(id)) return; // ✅ Skip if marked for removal
  
      const quantity = parseInt(normalizedQuantities[i]);
      if (quantity > 0) {
        const item = req.session.cart.find(it => it.id === id);
        if (item) {
          updatedCart.push({
            ...item,
            quantity
          });
        }
      }
    });

//   for (let i = 0; i < ids.length; i++) {
//     const id = ids[i];
//     const quantity = parseInt(quantities[i]);

//     // Skip if it's in the remove list
//     if (remove && remove.includes(id)) continue;

//     // Only keep valid quantity items
//     if (quantity > 0) {
//       const item = req.session.cart.find(it => it.id === id);
//       if (item) {
//         updatedCart.push({
//           ...item,
//           quantity
//         });
//       }
//     }
//   }
  
    req.session.cart = updatedCart;
    res.redirect("/cart");
  });

  
  router.get("/", (req, res) => {
    const cart = req.session.cart || [];
    const user = req.session.user || null;

    router.post("/add/:id", async (req, res) => {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.redirect("/menu");
      
        if (!req.session.cart) req.session.cart = [];
      
        // ✅ Check if item is already in cart
        const existingItem = req.session.cart.find(i => i.id === item._id.toString());
      
        if (existingItem) {
          existingItem.quantity += 1; // ✅ Increase quantity
        } else {
          req.session.cart.push({
            id: item._id.toString(),
            name: item.name,
            price: item.price,
            quantity: 1
          });
        }
      
        res.redirect("/menu");
      });
    console.log("🧠 user in session:", req.session.user);
    res.render("cart/index", {
      cart,
      user, // ✅ this one never gets hit
    });
  });

  router.post("/add/:id", async (req, res) => {
    try {
      const item = await MenuItem.findById(req.params.id);
      if (!item) return res.redirect("/menu");
  
      if (!req.session.cart) req.session.cart = [];
  
      const itemId = item._id.toString();
  
      const existingItemIndex = req.session.cart.findIndex(
        (i) => i.id === itemId
      );
  
      if (existingItemIndex > -1) {
        req.session.cart[existingItemIndex].quantity += 1;
      } else {
        req.session.cart.push({
          id: itemId,
          name: item.name,
          price: item.price,
          quantity: 1,
        });
      }
  
      // ✅ Wait until the session is saved before redirecting
      req.session.save(() => {
        res.redirect("/menu");
      });
    } catch (error) {
      console.error("🛑 Error adding item to cart:", error);
      res.status(500).send("Error adding to cart.");
    }
  });

  router.post("/ajax/add/:id", async (req, res) => {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
  
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
  
    // Calculate updated cart count
    const cartCount = req.session.cart.reduce((sum, i) => sum + i.quantity, 0);
  
    // Return a JSON response to the frontend
    res.json({ success: true, cartCount });
  });

//   router.post("/add/:id", async (req, res) => {
//     try {
//       const item = await MenuItem.findById(req.params.id);
//       if (!item) return res.redirect("/menu");
  
//       if (!req.session.cart) req.session.cart = [];
  
//       const itemId = item._id.toString();
  
//       const existingItemIndex = req.session.cart.findIndex(
//         (i) => i.id === itemId
//       );
  
//       if (existingItemIndex > -1) {
//         req.session.cart[existingItemIndex].quantity += 1;
//       } else {
//         req.session.cart.push({
//           id: itemId,
//           name: item.name,
//           price: item.price,
//           quantity: 1,
//         });
//       }
  
//       res.redirect("/menu");
//     } catch (error) {
//       console.error("🛑 Error adding item to cart:", error);
//       res.status(500).send("Error adding to cart.");
//     }
//   });

router.post("/checkout", (req, res) => {
    const { orderType, editAddress, newAddress } = req.body;
  
    if (orderType === "delivery") {
      if (editAddress && newAddress) {
        // You could save this to the DB in a real app
        req.session.deliveryAddress = newAddress;
      } else if (req.session.user && req.session.user.address) {
        req.session.deliveryAddress = req.session.user.address;
      } else {
        return res.send("No address provided.");
      }
    }
  
    // Store order type
    req.session.orderType = orderType;
  
    res.redirect("/cart/confirm"); // or /checkout or /thank-you
  });

export default router;