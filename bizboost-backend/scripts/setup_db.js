const { execSync } = require('child_process');
const sequelize = require('../src/config/db');
require('dotenv').config();

async function setupDatabase() {
    console.log('Starting database setup...');

    try {
        // 1. Drop Database
        console.log('Dropping database...');
        try {
            // Use npx sequelize-cli db:drop. 
            // Need to handle potential error if DB doesn't exist, but sequelize-cli usually handles it or we catch it.
            // Using cmd /c for Windows compatibility just in case
            execSync('cmd /c npx sequelize-cli db:drop', { stdio: 'inherit' });
        } catch (e) {
            console.log('Database drop failed or database did not exist. Continuing...');
        }

        // 2. Create Database
        console.log('Creating database...');
        execSync('cmd /c npx sequelize-cli db:create', { stdio: 'inherit' });

        // 3. Sync Models
        console.log('Syncing models...');
        // Load all models by requiring the app or models index if available.
        // Since app.js requires db and defines models implicitly or explicitly, 
        // we need to make sure all models are loaded into sequelize instance.
        // Let's require the model files directly to ensure they are defined on the sequelize instance.

        // We can assume src/models/index.js loads them, or we look at how app.js does it.
        // Looking at app.js: app.js requires routes, which require controllers, which require models. 
        // This is a bit indirect. 
        // Use fs to require all files in src/models seems safer to ensure they are registered.

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
