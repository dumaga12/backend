const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");
const requireAuth = require("../middleware/auth.middleware");

// GET ratings for a business
router.get("/business/:businessId", async (req, res) => {
    try {
        const User = require("../models/User");
        const ratings = await Rating.findAll({
            where: { business_id: req.params.businessId },
            include: [{
                model: User,
                attributes: ["full_name"]
            }],
            order: [["createdAt", "DESC"]]
        });
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD a rating
router.post("/", requireAuth, async (req, res) => {
    try {
        const { business_id, rating, comment } = req.body;
        const newRating = await Rating.create({
            user_id: req.user.id,
            business_id,
            rating,
            comment,
        });
        res.status(201).json(newRating);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
