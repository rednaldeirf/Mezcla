import { Router } from "express";
import MenuItem from "../models/menuItem.js";

const router = Router();

router.post("/add/:id", async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.redirect("/menu");

  if (!req.session.cart) req.session.cart = [];

  req.session.cart.push({
    id: item._id,
    name: item.name,
    price: item.price,
  });

  res.redirect("/menu");
});

// router.get("/", (req, res) => {
//   const cart = req.session.cart || [];
//   res.render("cart/index", { cart });
// });

  
  router.get("/", (req, res) => {
    const cart = req.session.cart || [];
    const user = req.session.user || null;
  
    console.log("🧠 user in session:", req.session.user);
    res.render("cart/index", {
      cart,
      user, // ✅ this one never gets hit
    });
  });

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