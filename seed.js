import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/menuItem.js';

dotenv.config();

const seedMenu = [
  // Appetizer
  {
    name: 'Samosa Empanadas',
    description: 'Indian-style samosa filling (spiced potatoes, peas, cumin, garam masala) in a crispy empanada shell. Served with cilantro-mint crema and tamarind salsa.',
    price: 7.99,
    category: 'Appetizer'
  },
  {
    name: 'Masala Nachos',
    description: 'Tortilla chips topped with spiced chole (chickpeas), paneer queso, pickled red onions, jalapeños, and mint chutney drizzle.',
    price: 8.99,
    category: 'Appetizer'
  },
  {
    name: 'Tandoori Elote',
    description: 'Grilled corn rubbed with tandoori masala butter, finished with cotija cheese, lime, and a dash of chaat masala.',
    price: 5.99,
    category: 'Appetizer'
  },

  // Main
  {
    name: 'Chicken Tikka Tacos',
    description: 'Soft corn tortillas filled with smoky chicken tikka, cucumber-onion slaw, and raita crema. Garnished with fresh coriander.',
    price: 12.99,
    category: 'Main'
  },
  {
    name: 'Paneer Tinga Quesadillas',
    description: 'Smoky chipotle paneer with onions and bell peppers in a crispy quesadilla, served with mango salsa and mint sour cream.',
    price: 11.5,
    category: 'Main'
  },
  {
    name: 'Lamb Keema Enchiladas',
    description: 'Soft corn tortillas stuffed with spiced lamb keema, baked in a tomato-cashew mole sauce, topped with cheese and cilantro.',
    price: 13.75,
    category: 'Main'
  },
  {
    name: 'Biryani Burrito',
    description: 'A bold burrito stuffed with saffron rice, spicy grilled veggies or chicken, raita, and green chutney. Wrapped in a paratha or tortilla.',
    price: 10.99,
    category: 'Main'
  },

  // Sides 
  {
    name: 'Kachumber Pico de Gallo',
    description: 'Indian-style chopped salad with tomatoes, onions, cucumber, lime juice, green chili—spiced like a pico.',
    price: 4.5,
    category: 'Side'
  },
  {
    name: 'Rajma Refried Beans',
    description: 'A twist on refried beans, made with Punjabi-style kidney beans mashed with garlic, cumin, and ghee.',
    price: 4.0,
    category: 'Side'
  },
  {
    name: 'Chaat-Spiced Guacamole',
    description: 'Creamy guac with roasted cumin, chaat masala, chopped green chilies, and pomegranate seeds.',
    price: 6.0,
    category: 'Side'
  },

  // Desserts
  {
    name: 'Churro Jalebi Bites',
    description: 'A hybrid of churros and jalebi—crispy, sugary spirals dusted with cinnamon and cardamom, served with chocolate-chai sauce.',
    price: 6.5,
    category: 'Dessert'
  },
  {
    name: 'Mango Lassi Tres Leches',
    description: 'Fluffy sponge cake soaked in a blend of mango lassi and three kinds of milk, topped with whipped cream and pistachios.',
    price: 7.25,
    category: 'Dessert'
  },

  // Drinks
  {
    name: 'Tamarind Margarita',
    description: 'Tamarind pulp, tequila, lime, and a hint of jaggery on the rocks with a chili-salt rim.',
    price: 9.0,
    category: 'Drink'
  },
  {
    name: 'Masala Horchata',
    description: 'Creamy rice milk infused with cinnamon, cardamom, and a splash of rosewater.',
    price: 4.5,
    category: 'Drink'
  }
];

try {
  await mongoose.connect(process.env.MONGODB_URI);
  await MenuItem.deleteMany(); // optional: wipe current menu
  await MenuItem.insertMany(seedMenu);
  console.log('Menu seeded successfully!');
  process.exit();
} catch (err) {
  console.error(err);
  process.exit(1);
}
