const express = require("express");
const router = express.Router();
const DealClaim = require("../models/dealClaim");
const Deal = require("../models/deal");
const authMiddleware = require("../middleware/auth.middleware");


router.post("/:dealId", authMiddleware, async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.dealId);
    if (!deal) return res.status(404).json({ message: "Deal not found" });

    const existingClaim = await DealClaim.findOne({
      where: { userId: req.user.id, dealId: deal.id },
    });
    if (existingClaim) return res.status(400).json({ message: "Already claimed" });

    const claim = await DealClaim.create({ userId: req.user.id, dealId: deal.id });
    res.status(201).json({ message: "Deal claimed", claim });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/my", authMiddleware, async (req, res) => {
  try {
    const claims = await DealClaim.findAll({ where: { userId: req.user.id } });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
