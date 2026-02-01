const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DealClaim = sequelize.define("DealClaim", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dealId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
    },
    redemption_code: {
        type: DataTypes.STRING,
        unique: true,
    },
    is_redeemed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    redeemed_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: "deal_claims",
    timestamps: true,
});

module.exports = DealClaim;