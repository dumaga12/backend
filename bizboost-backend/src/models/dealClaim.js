const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
const DealClaim = sequelize.define('DealClaim', {
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
defaultValue: 'pending',
},
});


return DealClaim;
};