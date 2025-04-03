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
    console.log("📦 Incoming form data:", req.body);
  
    const { quantities, ids, remove } = req.body;
  
    if (!ids || !quantities) {
      return res.send("Missing data — are you sure the form submitted correctly?");
    }
  
    const updatedCart = [];
  
    ids.forEach((id, index) => {
      if (!remove || !remove.includes(id)) {
        const currentItem = req.session.cart.find(i => i.id === id);
        if (currentItem) {
          updatedCart.push({
            ...currentItem,
            quantity: parseInt(quantities[index])
          });
        }
      }
    });
  
    req.session.cart = updatedCart;
    res.redirect("/cart");
  });

  
  router.get("/", (req, res) => {
    const cart = req.session.cart || [];
    const user = req.session.user || null;
  
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