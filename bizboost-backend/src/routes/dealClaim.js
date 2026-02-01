const express = require("express");
const router = express.Router();
const DealClaim = require("../models/dealClaim");
const Deal = require("../models/deal");
const authMiddleware = require("../middleware/auth.middleware");


const crypto = require("crypto");

router.post("/:dealId", authMiddleware, async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.dealId);
    if (!deal) return res.status(404).json({ message: "Deal not found" });

    // Scarcity check
    if (deal.total_quantity !== null && deal.claimed_count >= deal.total_quantity) {
      return res.status(400).json({ message: "Deal is fully claimed!" });
    }

    const existingClaim = await DealClaim.findOne({
      where: { userId: req.user.id, dealId: deal.id },
    });
    if (existingClaim) return res.status(400).json({ message: "Already claimed" });

    // Generate unique redemption code
    const redemption_code = `BZ-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    const claim = await DealClaim.create({
      userId: req.user.id,
      dealId: deal.id,
      redemption_code
    });

    // Increment claimed count
    await deal.increment("claimed_count");

    res.status(201).json({ message: "Deal claimed", claim });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REDEEM a deal (Business side or User side depending on UX, usually Business)
router.post("/redeem/:code", authMiddleware, async (req, res) => {
  try {
    const claim = await DealClaim.findOne({
      where: { redemption_code: req.params.code }
    });

    if (!claim) return res.status(404).json({ message: "Invalid redemption code" });
    if (claim.is_redeemed) return res.status(400).json({ message: "Code already redeemed" });

    claim.is_redeemed = true;
    claim.redeemed_at = new Date();
    await claim.save();

    // Award points (Gamification)
    const User = require("../models/User");
    const UserBadge = require("../models/UserBadge");
    const user = await User.findByPk(claim.userId);
    if (user) {
      await user.increment("points", { by: 10 });

      // Badge logic: Local Hero (3 unique business redemptions)
      const uniqueBusinesses = await DealClaim.count({
        where: { userId: user.id, is_redeemed: true },
        distinct: true,
        col: "dealId", // This is slightly simplified, ideally we'd join with Deals to get business_id
      });

      if (uniqueBusinesses >= 3) {
        await UserBadge.findOrCreate({
          where: { userId: user.id, badge_name: "Local Hero" },
          defaults: { badge_icon: "ShieldHero" }
        });
      }
    }

    res.json({ message: "Success! Deal redeemed. 10 points awarded!", claim });
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
