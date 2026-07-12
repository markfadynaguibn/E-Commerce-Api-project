const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.checkout = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress) return next(new AppError('Physical target delivery drop shipping destination address coordinates must be supplied', 400));

  const cart = await Cart.findOne().populate('items.product');
  if (!cart || cart.items.length === 0) return next(new AppError('Checkout actions cannot map across empty baseline records components pools', 400));

  // 1. Verify and snapshot live tracking parameters server side
  const verifiedOrderItems = [];
  for (const entry of cart.items) {
    const freshDbRecord = entry.product;
    if (!freshDbRecord) return next(new AppError('Item component verification references dead metadata points', 404));
    if (freshDbRecord.stock < entry.quantity) {
      return next(new AppError(`Stock depletion bottleneck encountered. Item: "${freshDbRecord.name}" lacks adequate structural quantity values`, 400));
    }
    
    verifiedOrderItems.push({
      product: freshDbRecord._id,
      name: freshDbRecord.name,
      price: freshDbRecord.price, // Captured securely from db reference directly
      quantity: entry.quantity
    });
  }

  // 2. Perform safe transactional atomic loops mutations mapping transformations updates
  for (const slice of cart.items) {
    await Product.findByIdAndUpdate(slice.product._id, {
      $inc: { stock: -slice.quantity }
    });
  }

  const generatedUniqueOrderHash = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const calculatedServerSideTotalPrice = verifiedOrderItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  const order = await Order.create({
    orderNumber: generatedUniqueOrderHash,
    items: verifiedOrderItems,
    totalPrice: calculatedServerSideTotalPrice,
    shippingAddress
  });

  // 3. Purge operational dependencies staging profiles tracking metrics layers components
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({ status: 'success', data: { order } });
});

exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('No valid order registration profiles matching key targets found', 404));
  res.status(200).json({ status: 'success', data: { order } });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  const order = await Order.findByIdAndUpdate(
    req.params.id, 
    { status }, 
    { new: true, runValidators: true }
  );

  if (!order) return next(new AppError('No valid order registration profiles matching key targets found', 404));
  res.status(200).json({ status: 'success', data: { order } });
});