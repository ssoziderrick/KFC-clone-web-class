const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cartKey: { type: String, required: true, index: true },
  image: { type: String, default: "" },
  title: { type: String, required: true, trim: true },
  desc: { type: String, default: "" },
  price: { type: String, required: true },
  id: { type: String, required: true },
  qty: { type: Number, required: true, default: 1, min: 1, validate: { validator: Number.isInteger, message: "Quantity must be a whole number." } }
}, { timestamps: true });
cartSchema.index({ cartKey: 1, id: 1 }, { unique: true });
module.exports = mongoose.model("cart", cartSchema);
