const Product = require('../models/product.model');
const Category = require('../models/category.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getProducts = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach(el => delete queryObj[el]);

  let filter = {};

  if (req.query.category) filter.category = req.query.category;
  if (req.query.inStock) filter.inStock = req.query.inStock === 'true';
  
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const products = await Product.find(filter);
  res.status(200).json({ status: 'success', results: products.length, data: { products } });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name description');
  if (!product) return next(new AppError('No matching unique product profile found', 404));
  res.status(200).json({ status: 'success', data: { product } });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const categoryExists = await Category.findById(req.body.category);
  if (!categoryExists) return next(new AppError('Associated parent configuration target category identifier not found', 404));

  const newProduct = await Product.create(req.body);
  res.status(201).json({ status: 'success', data: { product: newProduct } });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) return next(new AppError('Associated dynamic updating target category value not found', 404));
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return next(new AppError('No matching unique product profile found', 404));
  res.status(200).json({ status: 'success', data: { product } });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError('No matching unique product profile found', 404));
  res.status(200).json({ status: 'success', data: null });
});