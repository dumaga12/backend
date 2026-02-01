const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserBadge = sequelize.define("UserBadge", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    badge_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    badge_icon: {
        type: DataTypes.STRING,
    },
}, {
    tableName: "user_badges",
    timestamps: true,
});

module.exports = UserBadge;
