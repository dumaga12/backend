const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Wishlist = sequelize.define("Wishlist", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    deal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "wishlists",
});

module.exports = Wishlist;
