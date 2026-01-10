'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const { homePage } = require('../data/data.json');

/**
 * Bootstrap function to seed initial content into Strapi
 * Runs once on first startup after database initialization
 */
async function seedPelagicApp() {
  const shouldImportSeedData = await isFirstRun();

  if (shouldImportSeedData) {
    try {
      console.log('🌊 Setting up Pelagic Earth CMS...');
      await importSeedData();
      console.log('✅ Pelagic CMS bootstrap complete!');
    } catch (error) {
      console.error('❌ Could not import seed data');
      console.error(error);
    }
  } else {
    console.log(
      'ℹ️  Seed data has already been imported. Clear database to reimport.'
    );
  }
}

/**
 * Check if this is the first run by checking plugin store
 * Returns true if bootstrap hasn't run before
 */
async function isFirstRun() {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'type',
    name: 'setup',
  });
  const initHasRun = await pluginStore.get({ key: 'initHasRun' });
  await pluginStore.set({ key: 'initHasRun', value: true });
  return !initHasRun;
}

/**
 * Set public permissions for content types
 * Allows frontend to fetch content without authentication
 */
async function setPublicPermissions(newPermissions) {
  // Find the ID of the public role
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'public',
    },
  });

  if (!publicRole) {
    console.warn('⚠️  Public role not found, skipping permissions setup');
    return;
  }

  // Create the new permissions and link them to the public role
  const allPermissionsToCreate = [];
  Object.keys(newPermissions).forEach((controller) => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map((action) => {
      return strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  
  await Promise.all(allPermissionsToCreate);
  console.log('✅ Public permissions configured');
}

/**
 * Get file metadata for upload
 */
function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

/**
 * Parse file path from data.json format (e.g., "hero/hero-01.jpg" -> { dir: "hero", file: "hero-01.jpg" })
 */
function parseFilePath(filePath) {
  if (typeof filePath !== 'string') {
    throw new Error(`Invalid file path: ${filePath}`);
  }
  
  const parts = filePath.split('/');
  if (parts.length === 1) {
    return { dir: '', file: parts[0] };
  }
  const file = parts.pop();
  const dir = parts.join('/');
  return { dir, file };
}

function getFileData(filePathString) {
  const { dir, file } = parseFilePath(filePathString);
  const fullPath = path.join('data', 'uploads', dir, file);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  const size = getFileSizeInBytes(fullPath);
  const ext = file.split('.').pop();
  const mimeType = mime.lookup(ext || '') || '';

  return {
    filepath: fullPath,
    originalFileName: file,
    size,
    mimetype: mimeType,
  };
}

/**
 * Upload a file to Strapi media library
 * Returns the uploaded file entity
 */
async function uploadFile(file, name) {
  return strapi
    .plugin('upload')
    .service('upload')
    .upload({
      files: file,
      data: {
        fileInfo: {
          alternativeText: `Uploaded media file: ${name}`,
          caption: name,
          name,
        },
      },
    });
}

/**
 * Check if file already exists in Strapi media library
 * Returns existing file or uploads new one
 * Accepts file path string (e.g., "hero/hero-01.jpg") or array of paths
 */
async function checkFileExistsBeforeUpload(filePaths) {
  const existingFiles = [];
  const uploadedFiles = [];
  const filesArray = Array.isArray(filePaths) ? filePaths : [filePaths];

  for (const filePathString of filesArray) {
    if (!filePathString) continue; // Skip null/undefined
    
    const { file: fileName } = parseFilePath(filePathString);
    const fileNameNoExtension = fileName.replace(/\..*$/, '');
    
    // Check if the file already exists in Strapi
    const fileWhereName = await strapi.query('plugin::upload.file').findOne({
      where: {
        name: fileNameNoExtension,
      },
    });

    if (fileWhereName) {
      // File exists, don't upload it
      existingFiles.push(fileWhereName);
      console.log(`   ✓ File already exists: ${fileName}`);
    } else {
      // File doesn't exist, upload it
      try {
        const fileData = getFileData(filePathString);
        const [file] = await uploadFile(fileData, fileNameNoExtension);
        uploadedFiles.push(file);
        console.log(`   ✓ Uploaded: ${fileName}`);
      } catch (error) {
        console.error(`   ✗ Failed to upload ${filePathString}:`, error.message);
        throw error; // Re-throw to stop process on critical failures
      }
    }
  }
  
  const allFiles = [...existingFiles, ...uploadedFiles];
  // If only one file then return only that file, otherwise return array
  return allFiles.length === 1 ? allFiles[0] : allFiles;
}

/**
 * Create an entry in Strapi using Document Service API (v5)
 */
async function createEntry({ model, entry }) {
  try {
    await strapi.documents(`api::${model}.${model}`).create({
      data: entry,
    });
    console.log(`   ✓ Created ${model} entry`);
  } catch (error) {
    console.error(`   ✗ Failed to create ${model} entry:`, error.message);
    throw error;
  }
}

/**
 * Process a section and upload any media files it references
 * Returns the section with file paths replaced by Strapi file entities
 */
async function processSection(section) {
  const sectionCopy = { ...section };

  // Hero section - handle desktop and mobile images
  if (section.__component === 'sections.hero') {
    console.log('   Processing Hero section...');
    
    if (section.desktopHeroImage) {
      sectionCopy.desktopHeroImage = await checkFileExistsBeforeUpload(section.desktopHeroImage);
    }
    
    if (section.desktopSupportImages && Array.isArray(section.desktopSupportImages) && section.desktopSupportImages.length > 0) {
      sectionCopy.desktopSupportImages = await checkFileExistsBeforeUpload(section.desktopSupportImages);
    }
    
    if (section.mobileHeroImage) {
      sectionCopy.mobileHeroImage = await checkFileExistsBeforeUpload(section.mobileHeroImage);
    }
    
    if (section.mobileSupportImages && Array.isArray(section.mobileSupportImages) && section.mobileSupportImages.length > 0) {
      sectionCopy.mobileSupportImages = await checkFileExistsBeforeUpload(section.mobileSupportImages);
    }
  }
  
  // Milan Design Week section - handle video and thumbnail
  else if (section.__component === 'sections.milan-design-week') {
    console.log('   Processing Milan Design Week section...');
    
    if (section.video) {
      sectionCopy.video = await checkFileExistsBeforeUpload(section.video);
    }
    
    if (section.thumbnail) {
      sectionCopy.thumbnail = await checkFileExistsBeforeUpload(section.thumbnail);
    }
  }
  
  // FAQs section - no media, but items are already in correct format
  else if (section.__component === 'sections.faqs') {
    console.log('   Processing FAQs section...');
    // FAQ items are already correctly formatted, no media to process
  }
  
  // Mission, Impact sections - no media fields
  else {
    console.log(`   Processing ${section.__component} section...`);
    // No media fields to process for these sections
  }

  return sectionCopy;
}

/**
 * Import Home Page content
 * Processes SEO, sections, and creates the home-page entry
 */
async function importHomePage() {
  console.log('📄 Importing Home Page...');

  try {
    // Process SEO component
    let seoData = null;
    if (homePage.seo) {
      console.log('   Processing SEO...');
      seoData = { ...homePage.seo };
      
      // Upload share image if it exists
      if (homePage.seo.shareImage) {
        seoData.shareImage = await checkFileExistsBeforeUpload(homePage.seo.shareImage);
      } else {
        delete seoData.shareImage; // Remove null/undefined
      }
    }

    // Process all sections
    console.log(`   Processing ${homePage.sections.length} sections...`);
    const processedSections = [];
    
    for (let i = 0; i < homePage.sections.length; i++) {
      const section = homePage.sections[i];
      console.log(`   [${i + 1}/${homePage.sections.length}] Processing ${section.__component}...`);
      const processedSection = await processSection(section);
      processedSections.push(processedSection);
    }

    // Prepare home page entry data
    const homePageData = {
      seo: seoData,
      sections: processedSections,
    };

    // Create home-page entry (single type)
    // Note: For single types in Strapi v5, create() will create or update
    console.log('   Creating home-page entry...');
    try {
      await strapi.documents('api::home-page.home-page').create({
        data: homePageData,
      });
      console.log('   ✓ Home Page created successfully!');
    } catch (error) {
      // If entry already exists (unlikely on first run, but handle gracefully)
      if (error.message && error.message.includes('already exists')) {
        console.log('   Home page already exists, updating...');
        // For single types, we'd need to find and update - but this shouldn't happen on first run
        // For now, just log the error
        console.warn('   ⚠️  Home page entry already exists. Clear database to reimport.');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('   ✗ Failed to import Home Page:', error);
    throw error;
  }
}

/**
 * Main import function
 */
async function importSeedData() {
  console.log('📦 Starting seed data import...');

  // Set public permissions for content types
  await setPublicPermissions({
    'home-page': ['find', 'findOne'],
    'global-setting': ['find', 'findOne'],
    'journal-article': ['find', 'findOne'],
    'journal-page': ['find', 'findOne'],
  });

  // Import homepage content
  await importHomePage();

  // TODO: Import global settings if needed
  // await importGlobalSetting();

  console.log('✅ Seed data import complete');
}

// Export bootstrap function
module.exports = seedPelagicApp;
