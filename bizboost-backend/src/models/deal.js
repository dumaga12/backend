const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Deal = sequelize.define("Deal", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    business_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    original_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    discount_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    discount_percentage: {
        type: DataTypes.INTEGER,
    },
    discount_value: {
        type: DataTypes.STRING,
    },
    discount_type: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "General",
    },
    image_url: {
        type: DataTypes.STRING,
    },
    expiry_date: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "active",
    },
    is_perpetual: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    claimed_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: "deals",
    timestamps: true,
});

module.exports = Deal;