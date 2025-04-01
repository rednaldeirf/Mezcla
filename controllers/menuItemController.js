// import express from "express";
// import bcrypt from "bcrypt";
import MenuItem from "../models/menuItem.js";

// const router = express.Router();


//GET all menu items
const getAllMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find();
        return items;
    } catch (err) {
        throw err;
    }
};

//GET specific menu item
const getMenuItemById = async (id) => {
    return await MenuItem.findById(id);
  };
// const getMenuItemById = async ({ params: { id } }, res) => {
//     try {
//       const item = await MenuItem.findById(id);
//       if (!item) return res.status(404).json({ message: 'Item not found' });
//       res.json(item);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

  // POST create a new menu item
  const createMenuItem = async (req, res) => {
    const newItem = new MenuItem(req.body);
    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
  };


  //edit a menu item
  const updateMenuItem = async (req, res) => {
    try {
      const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.redirect('/menu');
    } catch (err) {
      res.status(400).send(err.message);
    }
  };

  //DELETE a menu item
  const deleteMenuItem = async (req, res) => {
    try {
      await MenuItem.findByIdAndDelete(req.params.id);
      res.redirect('/menu');
    } catch (err) {
      res.status(500).send(err.message);
    }
  };


  export {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
  };