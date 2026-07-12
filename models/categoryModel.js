const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is strictly required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    lowercase: true
  }
}, { timestamps: true });

// Auto slug generation hook before validating
categorySchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);