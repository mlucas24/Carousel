const mongoose = require("mongoose");
const faker = require("faker");

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, index: true },
  name: String,
  description: String,
  price: Number,
  rating: Number,
  reviews: Number,
  image: String,
  hasOptions: Boolean,
  isFamilyPriced: Boolean,
  isOnSale: Boolean,
  isNewItem: Boolean
});

module.exports = mongoose.model("Product", productSchema, "products");
