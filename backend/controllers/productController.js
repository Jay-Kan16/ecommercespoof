import Product from "../models/Product.js";

// @desc  Get all products (search, filter, pagination)
// @route GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
    const price = Object.keys(priceFilter).length ? { price: priceFilter } : {};

    const filter = { ...keyword, ...categoryFilter, ...price };

    let sort = { createdAt: -1 };
    if (req.query.sort === "price_asc") sort = { price: 1 };
    if (req.query.sort === "price_desc") sort = { price: -1 };
    if (req.query.sort === "rating") sort = { rating: -1 };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single product
// @route GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) return res.json(product);
    res.status(404).json({ message: "Product not found" });
  } catch (err) {
    next(err);
  }
};

// @desc  Get distinct categories
// @route GET /api/products/categories/all
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// @desc  Create a product
// @route POST /api/products  (admin)
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, image, category, brand, countInStock } = req.body;
    const product = new Product({
      name: name || "Sample name",
      price: price || 0,
      description: description || "Sample description",
      image: image || "/images/sample.jpg",
      category: category || "Uncategorized",
      brand: brand || "Generic",
      countInStock: countInStock || 0,
    });
    const created = await product.save();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// @desc  Update a product
// @route PUT /api/products/:id  (admin)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete a product
// @route DELETE /api/products/:id  (admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (err) {
    next(err);
  }
};

// @desc  Add a product review
// @route POST /api/products/:id/reviews
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    next(err);
  }
};
