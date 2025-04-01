import { Router } from "express";
import {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} from '../controllers/menuItemController.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
      const items = await getAllMenuItems(); // call function directly, return data
      res.render('menu/index', { menuItems: items });
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

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














export default router;