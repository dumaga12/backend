const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");

router.get("/protected", requireAuth, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

router.get(
  "/business-only",
  requireAuth,
  requireRole("business"),
  (req, res) => {
    res.json({ message: "Business access granted" });
  }
);

router.get(
  "/admin-only",
  requireAuth,
  requireRole("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

module.exports = router;
