const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, default: "" },
  price: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  lineTotal: { type: Number, required: true, min: 0 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  cartKey: { type: String, required: true, index: true },
  customer: {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    instructions: { type: String, default: "", trim: true },
  },
  items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
  subtotal: { type: Number, required: true, min: 0 },
  donation: { type: Number, default: 0, enum: [0, 500] },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, enum: ["UGX"], default: "UGX" },
  paymentMethod: { type: String, required: true, enum: ["cash_on_delivery"] },
  status: { type: String, required: true, enum: ["received", "cancelled"], default: "received" },
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);