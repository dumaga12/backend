const Business = require("../models/Business");

const verifyBusiness = async (req, res) => {
  const { businessId } = req.params;

  const business = await Business.findByPk(businessId);
  if (!business) {
    return res.status(404).json({ message: "Business not found" });
  }

  business.is_verified = true;
  await business.save();

  res.json({ message: "Business verified successfully" });
};

module.exports = { verifyBusiness };
