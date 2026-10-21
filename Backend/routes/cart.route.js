const { Router } = require("express");
const Cart = require("../model/cartSchema");
const cartRouter = Router();
const getCartKey = (req) => String(req.get("x-cart-id") || "").trim().slice(0, 120);
const parsePrice = (value) => Number(String(value).replace(/[^\d.-]/g, ""));

cartRouter.use((req, res, next) => {
  if (!getCartKey(req)) return res.status(400).json({ message: "Cart session is missing. Refresh the page and try again." });
  next();
});

cartRouter.post("/cart", async (req, res) => {
  try {
    const cartKey = getCartKey(req);
    const { id, image = "", title, desc = "", price, qty = 1 } = req.body;
    const quantity = Number(qty);
    if (!id || !title || price === undefined || !Number.isFinite(parsePrice(price)) || parsePrice(price) < 0) return res.status(400).json({ message: "A valid product ID, title and price are required." });
    if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: "Quantity must be a positive whole number." });
    const product = await Cart.findOneAndUpdate(
      { cartKey, id: String(id) },
      { $setOnInsert: { cartKey, id: String(id), image, title, desc, price: String(price) }, $inc: { qty: quantity } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ message: "Cart updated.", product });
  } catch (error) {
    console.error("Add to cart failed:", error.message);
    return res.status(500).json({ message: "Failed to add product to cart." });
  }
});

cartRouter.get("/cart", async (req, res) => {
  try {
    const items = await Cart.find({ cartKey: getCartKey(req) }).sort({ createdAt: 1 });
    const total = items.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
    return res.json({ count: items.reduce((sum, item) => sum + item.qty, 0), items, total: Math.round(total) });
  } catch (error) { console.error("Get cart failed:", error.message); return res.status(500).json({ message: "Failed to retrieve cart." }); }
});

cartRouter.get("/cart/:id", async (req, res) => {
  try {
    const item = await Cart.findOne({ cartKey: getCartKey(req), id: req.params.id });
    if (!item) return res.status(404).json({ message: "Cart item not found." });
    return res.json(item);
  } catch (error) { return res.status(500).json({ message: "Failed to retrieve cart item." }); }
});

cartRouter.put("/cart/:id", async (req, res) => {
  try {
    const quantity = Number(req.body.qty);
    if (!Number.isInteger(quantity) || quantity < 0) return res.status(400).json({ message: "Quantity must be a non-negative whole number." });
    const filter = { cartKey: getCartKey(req), id: req.params.id };
    if (quantity === 0) {
      const deleted = await Cart.findOneAndDelete(filter);
      if (!deleted) return res.status(404).json({ message: "Cart item not found." });
      return res.json({ message: "Product removed from cart.", product: deleted });
    }
    const product = await Cart.findOneAndUpdate(filter, { $set: { qty: quantity } }, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Cart item not found." });
    return res.json({ message: "Cart quantity updated.", product });
  } catch (error) { console.error("Update cart failed:", error.message); return res.status(500).json({ message: "Failed to update cart quantity." }); }
});

cartRouter.delete("/cart/:id", async (req, res) => {
  try {
    const product = await Cart.findOneAndDelete({ cartKey: getCartKey(req), id: req.params.id });
    if (!product) return res.status(404).json({ message: "Cart item not found." });
    return res.json({ message: "Product removed from cart.", product });
  } catch (error) { return res.status(500).json({ message: "Failed to remove product from cart." }); }
});

cartRouter.delete("/cart", async (req, res) => {
  try { await Cart.deleteMany({ cartKey: getCartKey(req) }); return res.json({ message: "Cart cleared." }); }
  catch (error) { return res.status(500).json({ message: "Failed to clear cart." }); }
});
module.exports = cartRouter;
