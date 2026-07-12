require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model');
const Cart = require('./models/cart.model');

const runSeederSequence = async () => {
  try {
    await connectDB();

    console.log('Initiating database cleanup routine...');
    await Order.deleteMany({});
    console.log('- Orders collection wiped out cleanly');
    await Cart.deleteMany({});
    console.log('- Carts tracking collections wiped out cleanly');
    await Product.deleteMany({});
    console.log('- Products tracking elements metrics container completely cleared');
    await Category.deleteMany({});
    console.log('- Category parent configuration blocks registry cleared');

    console.log('\nInjecting seed datasets tracking structures...');

    const generatedCategories = await Category.create([
      { name: 'Electronics', description: 'Gadgets, appliances, and high-tech hardware devices.' },
      { name: 'Apparel', description: 'Designer clothing accessories garments outfits.' },
      { name: 'Books', description: 'Educational materials, reference documentations, and novels.' }
    ]);
    console.log(`Successfully added [${generatedCategories.length}] Category records to the database.`);

    const seededProducts = await Product.create([
      {
        name: 'Smartphone Pro Max',
        description: 'Flagship tier performance hardware device with vivid display optics tracking panels.',
        price: 999.99,
        stock: 14,
        category: generatedCategories[0]._id,
        images: ['phone1.png', 'phone1_back.png']
      },
      {
        name: 'Wireless Noise Cancelling Headphones',
        description: 'Immersive acoustic insulation filtering profiles peripheral audio accessory hardware.',
        price: 249.50,
        stock: 35,
        category: generatedCategories[0]._id,
        images: ['headphones.png']
      },
      {
        name: 'Classic Leather Jacket',
        description: 'Premium tailored authentic materials fashion apparel outer layer item.',
        price: 189.00,
        stock: 8,
        category: generatedCategories[1]._id,
        images: ['jacket.png']
      },
      {
        name: 'Running Breathable Mesh Sneakers',
        description: 'Ergonomic athletic support underlays track traction equipment footwear.',
        price: 85.00,
        stock: 22,
        category: generatedCategories[1]._id,
        images: ['shoes.png']
      },
      {
        name: 'Mastering Node.js and Systems Architecture Blueprint',
        description: 'Deep analytical conceptual guide text dealing with performance tuning runtime execution engines patterns.',
        price: 45.99,
        stock: 50,
        category: generatedCategories[2]._id,
        images: ['book_node.png']
      },
      {
        name: 'The Quantum Physics Paradox Chronicals',
        description: 'Fictional exploratory saga mapped along advanced alternate spacetime dimensions theories.',
        price: 19.95,
        stock: 3,
        category: generatedCategories[2]._id,
        images: ['scifi.png']
      }
    ]);
    console.log(`Successfully added [${seededProducts.length}] Product records to the database.`);
    
    console.log('\nDatabase seeding process completed successfully!');
  } catch (error) {
    console.error(`Fatal crash anomaly encountered during data migration execution routines: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    console.log('Database reference channels safely uncoupled. Thread exited safely.');
    process.exit(0);
  }
};

runSeederSequence();