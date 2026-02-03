const express = require("express");
const router = express.Router();
const CartItem = require("../models/CartItem");
const Deal = require("../models/deal");
const requireAuth = require("../middleware/auth.middleware");

// GET user cart
router.get("/", requireAuth, async (req, res) => {
    try {
        const Business = require("../models/Business");
        const items = await CartItem.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Deal,
                include: [{
                    model: Business,
                    attributes: ["business_name"]
                }]
            }],
        });

        const formattedItems = items.map(item => {
            const itemJson = item.toJSON();
            if (itemJson.Deal) {
                itemJson.deal = itemJson.Deal;
                itemJson.deal.business_name = itemJson.Deal.Business?.business_name;
                delete itemJson.Deal;
                delete itemJson.deal.Business;
            }
            return itemJson;
        });

        res.json(formattedItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD to cart
router.post("/", requireAuth, async (req, res) => {
    try {
        const { deal_id, quantity } = req.body;
        const [item, created] = await CartItem.findOrCreate({
            where: { user_id: req.user.id, deal_id },
            defaults: { quantity: quantity || 1 },
        });
        if (!created) {
            item.quantity += (quantity || 1);
            await item.save();
        }
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REMOVE from cart
router.delete("/:id", requireAuth, async (req, res) => {
    try {
        await CartItem.destroy({ where: { id: req.params.id, user_id: req.user.id } });
        res.json({ message: "Removed from cart" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE quantity
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const { quantity } = req.body;
        const item = await CartItem.findOne({ where: { id: req.params.id, user_id: req.user.id } });
        if (!item) return res.status(404).json({ message: "Item not found" });
        item.quantity = quantity;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CLEAR cart
router.delete("/clear", requireAuth, async (req, res) => {
    try {
        await CartItem.destroy({ where: { user_id: req.user.id } });
        res.json({ message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
