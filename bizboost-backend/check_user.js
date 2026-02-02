const User = require('./src/models/User');
const sequelize = require('./src/config/db');

async function checkUser() {
    try {
        await sequelize.authenticate();
        const email = 'chidumagamikeibe@gmail.com';
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log('User exists:', user.toJSON());
        } else {
            console.log('User does not exist.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkUser();
