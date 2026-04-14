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

async function main() {
  try {
    process.env.ENABLE_SEEDING = process.env.ENABLE_SEEDING || 'true';
    process.env.FORCE_SEED = process.env.FORCE_SEED || 'true';

    console.log('🌊 Starting Pelagic CMS seed script...');
    console.log(
      `⚙️  Seed flags: ENABLE_SEEDING=${process.env.ENABLE_SEEDING} FORCE_SEED=${process.env.FORCE_SEED}`
    );
    console.log('📦 Compiling Strapi...');

    // Compile Strapi application
    const appContext = await compileStrapi();
    
    console.log('🚀 Creating Strapi instance...');
    // Create and load Strapi instance
    const app = await createStrapi(appContext).load();

    // Set log level to reduce noise (only errors)
    app.log.level = 'error';

    console.log('🌱 Bootstrap seed ran during Strapi load.');

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
