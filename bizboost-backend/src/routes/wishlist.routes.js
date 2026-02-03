const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const requireAuth = require("../middleware/auth.middleware");

// GET user wishlist
router.get("/", requireAuth, async (req, res) => {
    try {
        const Business = require("../models/Business");
        const Deal = require("../models/deal");
        const list = await Wishlist.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Deal,
                include: [{
                    model: Business,
                    attributes: ["business_name"]
                }]
            }]
        });

        const formattedList = list.map(item => {
            const itemJson = item.toJSON();
            if (itemJson.Deal) {
                itemJson.deal = itemJson.Deal; // For frontend compatibility if it expects 'deal' lowercase
                itemJson.Deal.business_name = itemJson.Deal.Business?.business_name;
                delete itemJson.Deal.Business;
            }
            return itemJson;
        });

        res.json(formattedList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD to wishlist
router.post("/", requireAuth, async (req, res) => {
    try {
        const { deal_id } = req.body;
        const item = await Wishlist.create({ user_id: req.user.id, deal_id });
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REMOVE from wishlist
router.delete("/:dealId", requireAuth, async (req, res) => {
    try {
        await Wishlist.destroy({
            where: { user_id: req.user.id, deal_id: req.params.dealId },
        });
        res.json({ message: "Removed from wishlist" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
