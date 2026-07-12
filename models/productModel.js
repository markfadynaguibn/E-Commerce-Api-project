const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name field is mandatory']
  },
  description: {
    type: String,
    required: [true, 'Product details description must be provided']
  },
  price: {
    type: Number,
    required: [true, 'Product price tracking valuation must be defined'],
    min: [0, 'Product pricing value cannot fall below 0']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Available warehouse item units balance cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'A bound parent category association is mandatory']
  },
  images: {
    type: [String],
    default: []
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Sync stock boolean dynamically before committing
productSchema.pre('save', function(next) {
  this.inStock = this.stock > 0;
  next();
});

module.exports = mongoose.model('Product', productSchema);