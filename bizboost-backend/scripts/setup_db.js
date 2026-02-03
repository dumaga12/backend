const { execSync } = require('child_process');
const sequelize = require('../src/config/db');
require('dotenv').config();

async function setupDatabase() {
    console.log('Starting database setup...');

    try {
      
        console.log('Dropping database...');
        try {
          
            execSync('cmd /c npx sequelize-cli db:drop', { stdio: 'inherit' });
        } catch (e) {
            console.log('Database drop failed or database did not exist. Continuing...');
        }

       
        console.log('Creating database...');
        execSync('cmd /c npx sequelize-cli db:create', { stdio: 'inherit' });

        console.log('Syncing models...');
       
        const fs = require('fs');
        const path = require('path');
        const modelsDir = path.join(__dirname, '../src/models');

        fs.readdirSync(modelsDir).forEach(file => {
            if (file.endsWith('.js')) {
                require(path.join(modelsDir, file));
            }
        });

        await sequelize.sync({ force: true });
        console.log('All models synced successfully.');

        console.log('Database setup complete!');
        process.exit(0);

    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
}

setupDatabase();
