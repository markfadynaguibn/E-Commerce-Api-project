const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      message: 'Status input must match either: Pending, Processing, Shipped, Delivered, Cancelled'
    },
    default: 'Pending'
  },
  shippingAddress: {
    type: String,
    required: [true, 'Physical target drop shipping location address is mandatory']
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);