const Business = require("../models/Business");

const createBusiness = async (req, res) => {
  try {
    const { business_name, description, address, phone } = req.body;

    const existing = await Business.findOne({
      where: { user_id: req.user.id },
    });

    if (existing) {
      return res.status(400).json({ message: "Business already exists" });
    }

    const business = await Business.create({
      user_id: req.user.id,
      business_name,
      description,
      address,
      phone,
    });

    res.status(201).json(business);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyBusiness = async (req, res) => {
  const business = await Business.findOne({
    where: { user_id: req.user.id },
  });

  if (!business) {
    return res.status(404).json({ message: "No business profile found" });
  }

  res.json(business);
};

module.exports = {
  createBusiness,
  getMyBusiness,
};
