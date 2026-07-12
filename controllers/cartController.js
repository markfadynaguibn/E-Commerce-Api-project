const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const recalculateCartPrice = (cart) => {
  cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
};

exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne().populate('items.product', 'name price images inStock');
  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  }
  res.status(200).json({ status: 'success', data: { cart } });
});

exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const qtyToAdd = Number(quantity) || 1;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product reference targeting invalid database records', 404));
  if (product.stock < qtyToAdd) return next(new AppError('Inbound transactional count request surpasses storage limitations', 400));

  let cart = await Cart.findOne();
  if (!cart) cart = new Cart({ items: [], totalPrice: 0 });

  const dynamicIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (dynamicIndex > -1) {
    const updatedQty = cart.items[dynamicIndex].quantity + qtyToAdd;
    if (product.stock < updatedQty) return next(new AppError('Aggregated final selection count overflows inventory availability pool', 400));
    cart.items[dynamicIndex].quantity = updatedQty;
    cart.items[dynamicIndex].price = product.price; // Strict DB Server Price Rule
  } else {
    cart.items.push({ product: productId, quantity: qtyToAdd, price: product.price });
  }

  recalculateCartPrice(cart);
  await cart.save();
  res.status(200).json({ status: 'success', data: { cart } });
});

exports.updateItemQuantity = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const targetedQty = Number(quantity);

  if (targetedQty < 0) return next(new AppError('Negative configuration counts are strictly forbidden', 400));

  let cart = await Cart.findOne();
  if (!cart) return next(new AppError('No shopping session container instanced yet', 404));

  const dynamicIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (dynamicIndex === -1) return next(new AppError('Targeted catalog index entity is not attached to this cart tracking reference', 404));

  if (targetedQty === 0) {
    cart.items.splice(dynamicIndex, 1);
  } else {
    const product = await Product.findById(productId);
    if (!product) return next(new AppError('Inventory validation database file records missing', 404));
    if (product.stock < targetedQty) return next(new AppError('Demanded execution volumes overflow present operational capacity limits', 400));
    
    cart.items[dynamicIndex].quantity = targetedQty;
    cart.items[dynamicIndex].price = product.price;
  }

  recalculateCartPrice(cart);
  await cart.save();
  res.status(200).json({ status: 'success', data: { cart } });
});

exports.removeItemFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  let cart = await Cart.findOne();
  if (!cart) return next(new AppError('Active system cart record registry completely empty', 404));

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  recalculateCartPrice(cart);
  await cart.save();

  res.status(200).json({ status: 'success', data: { cart } });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne();
  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  } else {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }
  res.status(200).json({ status: 'success', data: { cart } });
});