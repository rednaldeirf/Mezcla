import { Router } from "express";
import {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} from '../controllers/menuItemController.js';
import MenuItem from "../models/menuItem.js";

const router = Router();

// router.get('/', async (req, res) => {
//     try {
//       const items = await getAllMenuItems(); // call function directly, return data
//       res.render('menu/index', { menuItems: items });
//     } catch (err) {
//       res.status(500).send('Server error');
//     }
//   });

  router.get('/:id/edit', async (req, res) => {
    try {
      const item = await getMenuItemById(req.params.id);
      res.render('menu/edit', { item });
    } catch (err) {
      res.status(404).send('Item not found');
    }
  });

router.post('/', async (req, res) => {
    await createMenuItem(req, res);
  });

router.put('/:id', async (req, res) => {
  await updateMenuItem(req, res);
});

router.delete('/:id', async (req, res) => {
    console.log('💥 DELETE HIT', req.params.id);
  await deleteMenuItem(req, res);
});

// router.get("/menu", async (req, res) => {
//     const items = await MenuItem.find();
  
//     // Group by category
//     const categories = {};
//     for (let item of items) {
//       if (!categories[item.category]) categories[item.category] = [];
//       categories[item.category].push(item);
//     }
  
//     res.render("menu/index", {
//       categories,
//       cartCount: req.session.cart ? req.session.cart.length : 0
//     });
//   });

  router.get("/", async (req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      const items = await MenuItem.find();
      const categories = {};

      for (let item of items) {
        if (!categories[item.category]) {
          categories[item.category] = [];
        }
        categories[item.category].push(item);
      }

      const cartCount = req.session.cart
      ? req.session.cart.reduce((sum, item) => sum + item.quantity, 0)
      : 0;
      
      const welcomeMessage = req.session.welcomeMessage || null;
      delete req.session.welcomeMessage;

      res.render("menu/index", {
        categories,
        cartCount: req.session.cart ? req.session.cart.length : 0,
        welcomeMessage,
        user: req.session.user || null, 
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading menu");
    }
  });





export default router;