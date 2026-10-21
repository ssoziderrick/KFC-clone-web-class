const { Router } = require("express");
const Menu = require("../model/menuSchema");
const searchRouter = Router();

searchRouter.get("/item", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim().slice(0, 100);
    if (!search) return res.json([]);

    const literalSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const items = await Menu.find({
      title: { $regex: literalSearch, $options: "i" },
    }).limit(50);
    return res.json(items);
  } catch (error) {
    console.error("Menu search failed:", error.message);
    return res.status(500).json({ message: "Failed to search menu." });
  }
});
module.exports = searchRouter;
