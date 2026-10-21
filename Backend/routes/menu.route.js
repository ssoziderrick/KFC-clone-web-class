const { Router } = require("express");
const mongoose = require("mongoose");
const Menu = require("../model/menuSchema");

const menuRouter = Router();

// CREATE: Add a new product
menuRouter.post("/menu", async (req, res) => {
    try {
        const { image, title, desc, price, type } = req.body;

        if (!title || price === undefined || !type) {
            return res.status(400).json({
                message: "Title, price, and type are required."
            });
        }

        const product = await Menu.create({
            image,
            title,
            desc,
            price,
            type
        });

        return res.status(201).json({
            message: "Product created successfully.",
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to create product.",
            error: error.message
        });
    }
});


// READ: Get all products, with optional filtering by type
menuRouter.get("/menu", async (req, res) => {
    try {
        const query = {};

        if (req.query.type) {
            query.type = req.query.type;
        }

        const products = await Menu.find(query);

        return res.status(200).json(products);

    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve products.",
            error: error.message
        });
    }
});


// READ: Get one product by ID
menuRouter.get("/menu/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const product = await Menu.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        return res.status(200).json(product);

    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve product.",
            error: error.message
        });
    }
});


// UPDATE: Update an existing product by ID
menuRouter.put("/menu/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const allowedFields = [
            "image",
            "title",
            "desc",
            "price",
            "type"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Provide at least one field to update."
            });
        }

        const product = await Menu.findByIdAndUpdate(
            id,
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        return res.status(200).json({
            message: "Product updated successfully.",
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to update product.",
            error: error.message
        });
    }
});


// DELETE: Delete a product by ID
menuRouter.delete("/menu/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const product = await Menu.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully.",
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete product.",
            error: error.message
        });
    }
});

module.exports = menuRouter;
