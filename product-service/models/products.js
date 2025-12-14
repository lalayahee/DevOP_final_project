const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['trendy', 'minimalist', 'aesthetic', 'meme', 'artistic', 'vintage']
  },
  description: { type: String, required: true }
});

module.exports = mongoose.model("Product", ProductSchema);
