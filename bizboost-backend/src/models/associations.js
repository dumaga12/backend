const User = require("./User");
const Business = require("./Business");
const Rating = require("./Rating");
const Deal = require("./deal");
const DealClaim = require("./dealClaim");

const setupAssociations = () => {
    // User - Business
    User.hasOne(Business, { foreignKey: "user_id" });
    Business.belongsTo(User, { foreignKey: "user_id" });

    // Business - Deal
    Business.hasMany(Deal, { foreignKey: "business_id" });
    Deal.belongsTo(Business, { foreignKey: "business_id" });

    // User - Rating
    User.hasMany(Rating, { foreignKey: "user_id" });
    Rating.belongsTo(User, { foreignKey: "user_id" });

    // Business - Rating
    Business.hasMany(Rating, { foreignKey: "business_id" });
    Rating.belongsTo(Business, { foreignKey: "business_id" });

    // User - DealClaim
    User.hasMany(DealClaim, { foreignKey: "userId" });
    DealClaim.belongsTo(User, { foreignKey: "userId" });

    // Deal - DealClaim
    Deal.hasMany(DealClaim, { foreignKey: "dealId" });
    DealClaim.belongsTo(Deal, { foreignKey: "dealId" });
};

module.exports = setupAssociations;
