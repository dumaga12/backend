const express = require("express");
const router = express.Router();
const Deal = require("../models/deal");
const DealVerification = require("../models/DealVerification");
const authMiddleware = require("../middleware/auth.middleware");

// GET all deals
router.get("/", async (req, res) => {
  try {
    const Business = require("../models/Business");
    const deals = await Deal.findAll({
      include: [{
        model: Business,
        attributes: ["business_name"]
      }]
    });
    const formattedDeals = deals.map(d => {
      const dealJson = d.toJSON();
      dealJson.business_name = d.Business?.business_name;
      delete dealJson.Business;
      return dealJson;
    });
    res.json(formattedDeals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new deal
router.post("/", async (req, res) => {
  try {
    const newDeal = await Deal.create(req.body);
    res.status(201).json(newDeal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single deal by id
router.get("/:id", async (req, res) => {
  try {
    const Business = require("../models/Business");
    const deal = await Deal.findByPk(req.params.id, {
      include: [{
        model: Business,
        attributes: ["business_name"]
      }]
    });
    if (!deal) return res.status(404).json({ error: "Deal not found" });
    const dealJson = deal.toJSON();
    dealJson.business_name = deal.Business?.business_name;
    delete dealJson.Business;
    res.json(dealJson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a deal
router.put("/:id", async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);
    if (!deal) return res.status(404).json({ error: "Deal not found" });
    await deal.update(req.body);
    res.json(deal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a deal
router.delete("/:id", async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);
    if (!deal) return res.status(404).json({ error: "Deal not found" });
    await deal.destroy();
    res.json({ message: "Deal deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VERIFY a deal (Crowdsourced Verification)
router.post("/:id/verify", authMiddleware, async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);
    if (!deal) return res.status(404).json({ error: "Deal not found" });

    const [verification, created] = await DealVerification.findOrCreate({
      where: { userId: req.user.id, dealId: deal.id },
    });

    if (!created) return res.status(400).json({ message: "Already verified by you" });

    res.json({ message: "Thanks for verifying!", verification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET verification count for a deal
router.get("/:id/verifications", async (req, res) => {
  try {
    const count = await DealVerification.count({ where: { dealId: req.params.id } });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
