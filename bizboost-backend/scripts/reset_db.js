const { execSync } = require('child_process');
const sequelize = require('../src/config/db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function resetDatabase() {
    console.log('--- Database Reset Started ---');

    try {
        console.log('Step 1: Dropping database...');
        try {
            // Using sequelize-cli to drop the database
            execSync('npx sequelize-cli db:drop', { stdio: 'inherit' });
        } catch (e) {
            console.log('Database drop failed or database did not exist. Continuing...');
        }

        console.log('Step 2: Creating database...');
        execSync('npx sequelize-cli db:create', { stdio: 'inherit' });

        console.log('Step 3: Syncing models (Creating tables)...');
        // Ensure all models are loaded before syncing
        const modelsDir = path.join(__dirname, '../src/models');

        // Load associations first if it exists to handle relationships
        const associationsPath = path.join(modelsDir, 'associations.js');
        if (fs.existsSync(associationsPath)) {
            console.log('Loading associations...');
            require(associationsPath);
        }

        // Load all other models
        fs.readdirSync(modelsDir).forEach(file => {
            if (file.endsWith('.js') && file !== 'associations.js') {
                require(path.join(modelsDir, file));
            }
        });

        // Use force: true to drop and recreate tables based on model definitions
        await sequelize.sync({ force: true });
        console.log('All tables recreated successfully.');

        console.log('--- Database Reset Complete! ---');
        process.exit(0);

    } catch (error) {
        console.error('--- Database Reset Failed! ---');
        console.error(error);
        process.exit(1);
    }
}

resetDatabase();
