const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const {
  createBusiness,
  getMyBusiness,
} = require("../controllers/business.controller");

// Business user only
router.post(
  "/",
  requireAuth,
  requireRole("business"),
  createBusiness
);

router.get(
  "/me",
  requireAuth,
  requireRole("business"),
  getMyBusiness
);

module.exports = router;
