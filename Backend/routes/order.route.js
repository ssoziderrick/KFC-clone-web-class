const { Router } = require("express");
const Cart = require("../model/cartSchema");
const Order = require("../model/orderSchema");

const orderRouter = Router();
const getCartKey = (req) => String(req.get("x-cart-id") || "").trim().slice(0, 120);
const parsePrice = (value) => Number(String(value).replace(/[^\d.-]/g, ""));
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

orderRouter.post("/", async (req, res) => {
  try {
    const cartKey = getCartKey(req);
    if (!cartKey) return res.status(400).json({ message: "Cart session is missing. Refresh the page and try again." });

    const customer = {
      firstname: String(req.body.firstname || "").trim(),
      lastname: String(req.body.lastname || "").trim(),
      email: String(req.body.email || "").trim().toLowerCase(),
      phone: String(req.body.phone || "").trim(),
      address: String(req.body.address || "").trim(),
      instructions: String(req.body.instructions || "").trim(),
    };
    if (!customer.firstname || !customer.lastname || !emailPattern.test(customer.email) || !customer.phone || !customer.address) {
      return res.status(400).json({ message: "Enter your name, a valid email, phone number, and delivery address." });
    }

    const donation = Number(req.body.donation || 0);
    if (![0, 500].includes(donation)) return res.status(400).json({ message: "Donation must be UGX 0 or UGX 500." });

    const cartItems = await Cart.find({ cartKey }).sort({ createdAt: 1 });
    if (!cartItems.length) return res.status(400).json({ message: "Your cart is empty." });

    const items = cartItems.map((item) => {
      const unitPrice = parsePrice(item.price);
      if (!Number.isSafeInteger(unitPrice) || unitPrice < 0 || !Number.isInteger(item.qty) || item.qty < 1) {
        throw new Error("Cart contains an invalid item.");
      }
      return {
        id: item.id,
        title: item.title,
        image: item.image,
        price: item.price,
        qty: item.qty,
        lineTotal: unitPrice * item.qty,
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const order = await Order.create({
      cartKey,
      customer,
      items,
      subtotal,
      donation,
      total: subtotal + donation,
      currency: "UGX",
      paymentMethod: "cash_on_delivery",
    });

    try {
      await Cart.deleteMany({ cartKey });
    } catch (clearError) {
      console.error("Order saved but cart could not be cleared:", clearError.message);
    }

    return res.status(201).json({
      message: "Order placed successfully.",
      order: {
        id: order._id,
        status: order.status,
        total: order.total,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (error) {
    console.error("Checkout failed:", error.message);
    return res.status(500).json({ message: "Could not place your order. Please try again." });
  }
});

module.exports = orderRouter;