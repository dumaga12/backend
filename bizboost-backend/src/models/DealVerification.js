const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DealVerification = sequelize.define("DealVerification", {
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
}, {
    tableName: "deal_verifications",
    timestamps: true,
});

module.exports = DealVerification;
