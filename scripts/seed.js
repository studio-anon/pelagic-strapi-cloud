'use strict';

/**
 * Manual seed script for Pelagic Strapi CMS
 * 
 * This script allows you to manually seed the database without waiting for
 * the bootstrap process on Strapi startup.
 * 
 * Usage:
 *   npm run seed:homepage
 * 
 * Or directly:
 *   node scripts/seed.js
 * 
 * Note: This script requires Strapi to be built but not running.
 * It creates its own Strapi instance, seeds the data, then exits.
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');
const bootstrap = require('../src/bootstrap');

async function main() {
  try {
    console.log('🌊 Starting Pelagic CMS seed script...');
    console.log('📦 Compiling Strapi...');

    // Compile Strapi application
    const appContext = await compileStrapi();
    
    console.log('🚀 Creating Strapi instance...');
    // Create and load Strapi instance
    const app = await createStrapi(appContext).load();

    // Set log level to reduce noise (only errors)
    app.log.level = 'error';

    console.log('🌱 Running seed function...');
    // Run the bootstrap seed function
    // This will check isFirstRun and import seed data
    await bootstrap();

    console.log('✅ Seed script completed successfully!');
    console.log('🔌 Destroying Strapi instance...');
    
    // Clean up: destroy the Strapi instance
    await app.destroy();

    console.log('✨ All done! You can now start Strapi with: npm run develop');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed script failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();
