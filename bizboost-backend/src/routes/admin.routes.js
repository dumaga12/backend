const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const { verifyBusiness } = require("../controllers/admin.controller");

router.patch(
  "/verify-business/:businessId",
  requireAuth,
  requireRole("admin"),
  verifyBusiness
);

module.exports = router;
