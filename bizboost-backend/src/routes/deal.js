const express = require("express");
const router = express.Router();
const Deal = require("../models/deal");

// GET all deals
router.get("/", async (req, res) => {
  try {
    const deals = await Deal.findAll();
    res.json(deals);
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
    const deal = await Deal.findByPk(req.params.id);
    if (!deal) return res.status(404).json({ error: "Deal not found" });
    res.json(deal);
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

module.exports = router;
