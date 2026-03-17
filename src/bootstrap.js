'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const {
  homePage,
  globalSetting,
  journalPage,
  journalArticles,
  missionPage,
  pavePage,
  modFactoryPage,
} = require('../data/data.json');

/**
 * Bootstrap function to seed initial content into Strapi
 * Runs once on first startup after database initialization
 */
async function seedPelagicApp() {
  const forceSeed = process.env.FORCE_SEED === 'true';
  const shouldImportSeedData = forceSeed || (await isFirstRun());

  if (shouldImportSeedData) {
    try {
      console.log('🌊 Setting up Pelagic Earth CMS...');
      if (forceSeed) {
        console.log('ℹ️  FORCE_SEED enabled: running idempotent seed import');
      }
      await importSeedData();
      console.log('✅ Pelagic CMS bootstrap complete!');
    } catch (error) {
      console.error('❌ Could not import seed data');
      console.error(error);
    }
  } else {
    console.log(
      'ℹ️  Seed data has already been imported. Clear database or run with FORCE_SEED=true to reimport idempotently.'
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

/**
 * Build a stable upload name from the full seed file path.
 * Prevents collisions for common names like "bg.png" in different folders.
 */
function getUploadNameFromPath(filePathString) {
  const { dir, file } = parseFilePath(filePathString);
  const fileNameNoExtension = file.replace(/\..*$/, '');

  if (!dir) {
    return fileNameNoExtension;
  }

  return `${dir}-${fileNameNoExtension}`.replace(/[\\/]+/g, '-');
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
    const uploadName = getUploadNameFromPath(filePathString);
    
    // Check if the file already exists in Strapi
    const fileWhereName = await strapi.query('plugin::upload.file').findOne({
      where: {
        name: uploadName,
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
        const [file] = await uploadFile(fileData, uploadName);
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
  
  // Applications section - handle nested items with images
  else if (section.__component === 'sections.applications') {
    console.log('   Processing Applications section...');
    
    if (section.applications && Array.isArray(section.applications) && section.applications.length > 0) {
      sectionCopy.applications = [];
      for (let i = 0; i < section.applications.length; i++) {
        const application = section.applications[i];
        const processedApplication = { ...application };
        
        if (application.imageMobile) {
          processedApplication.imageMobile = await checkFileExistsBeforeUpload(application.imageMobile);
        }
        
        if (application.imageDesktop) {
          processedApplication.imageDesktop = await checkFileExistsBeforeUpload(application.imageDesktop);
        }
        
        sectionCopy.applications.push(processedApplication);
      }
    }
  }
  
  // FAQs section - no media, but items are already in correct format
  else if (section.__component === 'sections.faqs') {
    console.log('   Processing FAQs section...');
    // FAQ items are already correctly formatted, no media to process
  }
  
  // Contact section - no media fields, blocks are already in correct format
  else if (section.__component === 'sections.contact') {
    console.log('   Processing Contact section...');
    // Contact blocks are already correctly formatted, no media to process
  }
  
  // Small Gallery section - handle nested items with responsive images
  else if (section.__component === 'sections.small-gallery') {
    console.log('   Processing Small Gallery section...');
    
    if (section.items && Array.isArray(section.items) && section.items.length > 0) {
      sectionCopy.items = [];
      for (let i = 0; i < section.items.length; i++) {
        const item = section.items[i];
        const processedItem = { ...item };
        
        if (item.desktopImage) {
          processedItem.desktopImage = await checkFileExistsBeforeUpload(item.desktopImage);
        }
        
        if (item.mobileImage) {
          processedItem.mobileImage = await checkFileExistsBeforeUpload(item.mobileImage);
        }
        
        sectionCopy.items.push(processedItem);
      }
    }
  }
  
  // Mission, Impact sections - no media fields
  else {
    console.log(`   Processing ${section.__component} section...`);
    // No media fields to process for these sections
  }

  return sectionCopy;
}

/**
 * Process a mission section and upload any media files it references
 */
async function processMissionSection(section) {
  const sectionCopy = { ...section };
  const component = section?.__component;

  if (!component) {
    return sectionCopy;
  }

  if (component === 'mission.mission-direction-panel') {
    if (section.largeImage) {
      sectionCopy.largeImage = await checkFileExistsBeforeUpload(section.largeImage);
    }
    if (section.smallImage) {
      sectionCopy.smallImage = await checkFileExistsBeforeUpload(section.smallImage);
    }
    return sectionCopy;
  }

  if (component === 'mission.mission-turning-point-panel') {
    if (section.largeImage) {
      sectionCopy.largeImage = await checkFileExistsBeforeUpload(section.largeImage);
    }
    if (section.smallImage) {
      sectionCopy.smallImage = await checkFileExistsBeforeUpload(section.smallImage);
    }
    if (section.backgroundImage) {
      sectionCopy.backgroundImage = await checkFileExistsBeforeUpload(section.backgroundImage);
    }
    return sectionCopy;
  }

  if (component === 'mission.mission-discarded-item-panel') {
    if (section.backgroundImage) {
      sectionCopy.backgroundImage = await checkFileExistsBeforeUpload(section.backgroundImage);
    }
    return sectionCopy;
  }

  if (component === 'mission.mission-paver-panel') {
    if (section.backgroundImage) {
      sectionCopy.backgroundImage = await checkFileExistsBeforeUpload(section.backgroundImage);
    }
    return sectionCopy;
  }

  if (component === 'mission.mission-process-panel') {
    if (section.image01) {
      sectionCopy.image01 = await checkFileExistsBeforeUpload(section.image01);
    }
    if (section.image02) {
      sectionCopy.image02 = await checkFileExistsBeforeUpload(section.image02);
    }
    if (section.image03) {
      sectionCopy.image03 = await checkFileExistsBeforeUpload(section.image03);
    }
    return sectionCopy;
  }

  if (component === 'mission.mission-close-panel') {
    if (section.logo) {
      sectionCopy.logo = await checkFileExistsBeforeUpload(section.logo);
    }
    return sectionCopy;
  }

  if (component === 'mission.mission-team-panel') {
    if (section.backgroundImage) {
      sectionCopy.backgroundImage = await checkFileExistsBeforeUpload(section.backgroundImage);
    }

    if (Array.isArray(section.profiles01)) {
      sectionCopy.profiles01 = [];
      for (const profile of section.profiles01) {
        const profileCopy = { ...profile };
        if (profile.image) {
          profileCopy.image = await checkFileExistsBeforeUpload(profile.image);
        }
        sectionCopy.profiles01.push(profileCopy);
      }
    }

    if (Array.isArray(section.profiles02)) {
      sectionCopy.profiles02 = [];
      for (const profile of section.profiles02) {
        const profileCopy = { ...profile };
        if (profile.image) {
          profileCopy.image = await checkFileExistsBeforeUpload(profile.image);
        }
        sectionCopy.profiles02.push(profileCopy);
      }
    }

    return sectionCopy;
  }

  if (component === 'mission.mission-final-quote-panel') {
    if (section.image) {
      sectionCopy.image = await checkFileExistsBeforeUpload(section.image);
    }
    return sectionCopy;
  }

  // intro/stat/vision panels do not include media fields
  return sectionCopy;
}

/**
 * Process a journal content block and upload any media it references
 */
async function processJournalContentBlock(block) {
  const blockCopy = { ...block };
  const componentType = block?.__component;

  if (!componentType) {
    return blockCopy;
  }

  if (componentType === 'journal.full-width-image') {
    if (block.desktopImage) {
      blockCopy.desktopImage = await checkFileExistsBeforeUpload(
        block.desktopImage
      );
    }
    if (block.mobileImage) {
      blockCopy.mobileImage = await checkFileExistsBeforeUpload(block.mobileImage);
    }
    return blockCopy;
  }

  if (componentType === 'journal.two-images') {
    if (block.desktopImage01) {
      blockCopy.desktopImage01 = await checkFileExistsBeforeUpload(
        block.desktopImage01
      );
    }
    if (block.mobileImage01) {
      blockCopy.mobileImage01 = await checkFileExistsBeforeUpload(
        block.mobileImage01
      );
    }
    if (block.desktopImage02) {
      blockCopy.desktopImage02 = await checkFileExistsBeforeUpload(
        block.desktopImage02
      );
    }
    if (block.mobileImage02) {
      blockCopy.mobileImage02 = await checkFileExistsBeforeUpload(
        block.mobileImage02
      );
    }
    return blockCopy;
  }

  if (
    componentType === 'journal.text-image-pair-left' ||
    componentType === 'journal.text-image-pair-right'
  ) {
    if (block.image) {
      blockCopy.image = await checkFileExistsBeforeUpload(block.image);
    }
    return blockCopy;
  }

  if (componentType === 'journal.video-embed') {
    if (block.desktopImage) {
      blockCopy.desktopImage = await checkFileExistsBeforeUpload(
        block.desktopImage
      );
    }
    if (block.mobileImage) {
      blockCopy.mobileImage = await checkFileExistsBeforeUpload(block.mobileImage);
    }
    if (block.videoFile) {
      blockCopy.videoFile = await checkFileExistsBeforeUpload(block.videoFile);
    }
    return blockCopy;
  }

  // journal.breakout-text, journal.single-column, journal.two-column
  return blockCopy;
}

/**
 * Process a product section and upload any media files it references
 */
async function processProductSection(section) {
  const sectionCopy = { ...section };
  const component = section?.__component;

  if (!component) {
    return sectionCopy;
  }

  if (component === 'products.hero-configurator') {
    if (Array.isArray(section.designs)) {
      sectionCopy.designs = [];
      for (const design of section.designs) {
        const designCopy = { ...design };
        if (design.icon) {
          designCopy.icon = await checkFileExistsBeforeUpload(design.icon);
        }
        sectionCopy.designs.push(designCopy);
      }
    }

    if (Array.isArray(section.colours)) {
      sectionCopy.colours = [];
      for (const colour of section.colours) {
        const colourCopy = { ...colour };
        if (colour.swatchImage) {
          colourCopy.swatchImage = await checkFileExistsBeforeUpload(colour.swatchImage);
        }
        sectionCopy.colours.push(colourCopy);
      }
    }

    if (Array.isArray(section.gallerySets)) {
      sectionCopy.gallerySets = [];
      for (const gallerySet of section.gallerySets) {
        const gallerySetCopy = { ...gallerySet };
        if (Array.isArray(gallerySet.images) && gallerySet.images.length > 0) {
          gallerySetCopy.images = await checkFileExistsBeforeUpload(gallerySet.images);
        }
        sectionCopy.gallerySets.push(gallerySetCopy);
      }
    }

    return sectionCopy;
  }

  if (component === 'products.hero-standard') {
    if (section.image) {
      sectionCopy.image = await checkFileExistsBeforeUpload(section.image);
    }
    return sectionCopy;
  }

  if (component === 'products.technical-showcase') {
    if (section.image) {
      sectionCopy.image = await checkFileExistsBeforeUpload(section.image);
    }
    if (section.textureImage) {
      sectionCopy.textureImage = await checkFileExistsBeforeUpload(section.textureImage);
    }
    return sectionCopy;
  }

  if (component === 'products.use-cases') {
    if (Array.isArray(section.cards)) {
      sectionCopy.cards = [];
      for (const card of section.cards) {
        const cardCopy = { ...card };
        if (card.image) {
          cardCopy.image = await checkFileExistsBeforeUpload(card.image);
        }
        sectionCopy.cards.push(cardCopy);
      }
    }
    return sectionCopy;
  }

  if (component === 'products.closing-quote-impact-cta') {
    if (section.primaryImage) {
      sectionCopy.primaryImage = await checkFileExistsBeforeUpload(section.primaryImage);
    }
    if (section.secondaryImage) {
      sectionCopy.secondaryImage = await checkFileExistsBeforeUpload(section.secondaryImage);
    }
    return sectionCopy;
  }

  if (component === 'products.voice-testimonial') {
    if (section.portraitImage) {
      sectionCopy.portraitImage = await checkFileExistsBeforeUpload(section.portraitImage);
    }
    if (section.supportImage) {
      sectionCopy.supportImage = await checkFileExistsBeforeUpload(section.supportImage);
    }
    return sectionCopy;
  }

  if (component === 'products.featured-in') {
    if (Array.isArray(section.outlets)) {
      sectionCopy.outlets = [];
      for (const outlet of section.outlets) {
        const outletCopy = { ...outlet };
        if (outlet.darkImage) {
          outletCopy.darkImage = await checkFileExistsBeforeUpload(outlet.darkImage);
        }
        if (outlet.lightImage) {
          outletCopy.lightImage = await checkFileExistsBeforeUpload(outlet.lightImage);
        }
        sectionCopy.outlets.push(outletCopy);
      }
    }
    return sectionCopy;
  }

  if (component === 'products.metrics-suite') {
    if (section.backgroundImage) {
      sectionCopy.backgroundImage = await checkFileExistsBeforeUpload(section.backgroundImage);
    }

    if (section.techSpec && Array.isArray(section.techSpec.variants)) {
      const techSpecCopy = { ...section.techSpec };
      techSpecCopy.variants = [];
      for (const variant of section.techSpec.variants) {
        const variantCopy = { ...variant };
        if (variant.productImageDesktop) {
          variantCopy.productImageDesktop = await checkFileExistsBeforeUpload(
            variant.productImageDesktop
          );
        }
        if (variant.productImageMobile) {
          variantCopy.productImageMobile = await checkFileExistsBeforeUpload(
            variant.productImageMobile
          );
        }
        techSpecCopy.variants.push(variantCopy);
      }
      sectionCopy.techSpec = techSpecCopy;
    }

    return sectionCopy;
  }

  if (component === 'products.mod-factory-hero') {
    if (section.desktopHeroImage) {
      sectionCopy.desktopHeroImage = await checkFileExistsBeforeUpload(section.desktopHeroImage);
    }
    if (section.mobileHeroImage) {
      sectionCopy.mobileHeroImage = await checkFileExistsBeforeUpload(section.mobileHeroImage);
    }
    return sectionCopy;
  }

  if (component === 'products.container-statement') {
    if (section.desktopMainImage) {
      sectionCopy.desktopMainImage = await checkFileExistsBeforeUpload(section.desktopMainImage);
    }
    if (section.mobileMainImage) {
      sectionCopy.mobileMainImage = await checkFileExistsBeforeUpload(section.mobileMainImage);
    }
    if (section.desktopSideImage) {
      sectionCopy.desktopSideImage = await checkFileExistsBeforeUpload(section.desktopSideImage);
    }
    if (section.mobileSideImage) {
      sectionCopy.mobileSideImage = await checkFileExistsBeforeUpload(section.mobileSideImage);
    }
    return sectionCopy;
  }

  if (component === 'products.impact-grid') {
    if (Array.isArray(section.cards)) {
      sectionCopy.cards = [];
      for (const card of section.cards) {
        const cardCopy = { ...card };
        if (card.image) {
          cardCopy.image = await checkFileExistsBeforeUpload(card.image);
        }
        sectionCopy.cards.push(cardCopy);
      }
    }
    return sectionCopy;
  }

  if (component === 'products.deploy-steps') {
    if (Array.isArray(section.steps)) {
      sectionCopy.steps = [];
      for (const step of section.steps) {
        const stepCopy = { ...step };
        if (step.icon) {
          stepCopy.icon = await checkFileExistsBeforeUpload(step.icon);
        }
        sectionCopy.steps.push(stepCopy);
      }
    }
    return sectionCopy;
  }

  if (component === 'products.technical-specs') {
    if (section.diagramLottie) {
      sectionCopy.diagramLottie = await checkFileExistsBeforeUpload(section.diagramLottie);
    }
    if (section.diagramImage) {
      sectionCopy.diagramImage = await checkFileExistsBeforeUpload(section.diagramImage);
    }
    if (section.backgroundImage) {
      sectionCopy.backgroundImage = await checkFileExistsBeforeUpload(section.backgroundImage);
    }
    return sectionCopy;
  }

  if (component === 'products.global-scale') {
    if (section.image) {
      sectionCopy.image = await checkFileExistsBeforeUpload(section.image);
    }
    return sectionCopy;
  }

  if (component === 'products.factory-target') {
    if (section.desktopImage) {
      sectionCopy.desktopImage = await checkFileExistsBeforeUpload(section.desktopImage);
    }
    if (section.mobileImage) {
      sectionCopy.mobileImage = await checkFileExistsBeforeUpload(section.mobileImage);
    }
    return sectionCopy;
  }

  // products.closing-quote-simple and products.metrics-basic do not include media fields
  return sectionCopy;
}

/**
 * Import Home Page content
 * Processes SEO, sections, and creates the home-page entry
 */
async function importHomePage() {
  console.log('📄 Importing Home Page...');

  try {
    const existingHomePage = await strapi.db
      .query('api::home-page.home-page')
      .findOne({ where: {} });

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

    const existingDocumentId =
      existingHomePage?.documentId || existingHomePage?.document_id;

    try {
      if (existingDocumentId) {
        console.log('   Updating home-page entry...');
        await strapi.documents('api::home-page.home-page').update({
          documentId: existingDocumentId,
          data: homePageData,
        });
        console.log('   ✓ Home Page updated successfully!');
        return;
      }

      console.log('   Creating home-page entry...');
      await strapi.documents('api::home-page.home-page').create({
        data: homePageData,
      });
      console.log('   ✓ Home Page created successfully!');
    } catch (error) {
      // Handle single-type collisions gracefully if Strapi rejects create/update.
      if (error.message && error.message.includes('already exists')) {
        console.warn('   ⚠️  Home page entry already exists but could not be updated automatically.');
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
 * Import Global Settings content
 * Processes site-wide settings including footer data
 */
async function importGlobalSetting() {
  console.log('⚙️  Importing Global Settings...');

  try {
    if (!globalSetting) {
      console.log('   No global settings data found, skipping...');
      return;
    }

    const existingGlobalSetting = await strapi.db
      .query('api::global-setting.global-setting')
      .findOne({ where: {} });

    // Prepare global setting entry data
    const globalSettingData = {
      siteName: globalSetting.siteName || 'Pelagic Earth',
      footerTagline: globalSetting.footerTagline || null,
      copyrightText: globalSetting.copyrightText || null,
      privacySlug: globalSetting.privacySlug || null,
      termsSlug: globalSetting.termsSlug || null,
      socialLinks: globalSetting.socialLinks || [],
    };

    const existingDocumentId =
      existingGlobalSetting?.documentId || existingGlobalSetting?.document_id;

    try {
      if (existingDocumentId) {
        console.log('   Updating global-setting entry...');
        await strapi.documents('api::global-setting.global-setting').update({
          documentId: existingDocumentId,
          data: globalSettingData,
        });
        console.log('   ✓ Global Settings updated successfully!');
        return;
      }

      console.log('   Creating global-setting entry...');
      await strapi.documents('api::global-setting.global-setting').create({
        data: globalSettingData,
      });
      console.log('   ✓ Global Settings created successfully!');
    } catch (error) {
      // If entry already exists (unlikely on first run, but handle gracefully)
      if (error.message && error.message.includes('already exists')) {
        console.warn('   ⚠️  Global settings entry already exists but could not be updated automatically.');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('   ✗ Failed to import Global Settings:', error);
    throw error;
  }
}

/**
 * Import Mission Page content
 * Processes mission sections and upserts the mission-page entry
 */
async function importMissionPage() {
  console.log('🧭 Importing Mission Page...');

  try {
    if (!missionPage) {
      console.log('   No mission page data found, skipping...');
      return;
    }

    const existingMissionPage = await strapi.db
      .query('api::mission-page.mission-page')
      .findOne({ where: {} });
    const existingDocumentId =
      existingMissionPage?.documentId || existingMissionPage?.document_id;

    let seoData = null;
    if (missionPage.seo) {
      seoData = { ...missionPage.seo };
      if (missionPage.seo.shareImage) {
        seoData.shareImage = await checkFileExistsBeforeUpload(missionPage.seo.shareImage);
      } else {
        delete seoData.shareImage;
      }
    }

    const missionSections = Array.isArray(missionPage.sections) ? missionPage.sections : [];
    const processedSections = [];
    for (let i = 0; i < missionSections.length; i++) {
      const section = missionSections[i];
      console.log(`   [${i + 1}/${missionSections.length}] Processing ${section.__component}...`);
      processedSections.push(await processMissionSection(section));
    }

    const missionPageData = {
      title: missionPage.title || 'Mission',
      seo: seoData,
      sections: processedSections,
    };

    if (existingDocumentId) {
      console.log('   Updating mission-page entry...');
      await strapi.documents('api::mission-page.mission-page').update({
        documentId: existingDocumentId,
        data: missionPageData,
        status: 'published',
      });
      console.log('   ✓ Mission Page updated successfully!');
      return;
    }

    console.log('   Creating mission-page entry...');
    await strapi.documents('api::mission-page.mission-page').create({
      data: missionPageData,
      status: 'published',
    });
    console.log('   ✓ Mission Page created successfully!');
  } catch (error) {
    console.error('   ✗ Failed to import Mission Page:', error);
    throw error;
  }
}

/**
 * Import product single type content
 * Handles both pave-page and mod-factory-page schemas
 */
async function importProductPage(model, titleFallback, seedData) {
  const pageLabel = model === 'pave-page' ? 'Pave Page' : 'Mod.factory Page';
  console.log(`🧱 Importing ${pageLabel}...`);

  try {
    if (!seedData) {
      console.log(`   No ${model} data found, skipping...`);
      return;
    }

    const existingEntry = await strapi.db
      .query(`api::${model}.${model}`)
      .findOne({ where: {} });
    const existingDocumentId = existingEntry?.documentId || existingEntry?.document_id;

    let seoData = null;
    if (seedData.seo) {
      seoData = { ...seedData.seo };
      if (seedData.seo.shareImage) {
        seoData.shareImage = await checkFileExistsBeforeUpload(seedData.seo.shareImage);
      } else {
        delete seoData.shareImage;
      }
    }

    const productSections = Array.isArray(seedData.sections) ? seedData.sections : [];
    const processedSections = [];
    for (let i = 0; i < productSections.length; i++) {
      const section = productSections[i];
      console.log(`   [${i + 1}/${productSections.length}] Processing ${section.__component}...`);
      processedSections.push(await processProductSection(section));
    }

    const pageData = {
      title: seedData.title || titleFallback,
      seo: seoData,
      sections: processedSections,
    };

    if (existingDocumentId) {
      console.log(`   Updating ${model} entry...`);
      await strapi.documents(`api::${model}.${model}`).update({
        documentId: existingDocumentId,
        data: pageData,
        status: 'published',
      });
      console.log(`   ✓ ${pageLabel} updated successfully!`);
      return;
    }

    console.log(`   Creating ${model} entry...`);
    await strapi.documents(`api::${model}.${model}`).create({
      data: pageData,
      status: 'published',
    });
    console.log(`   ✓ ${pageLabel} created successfully!`);
  } catch (error) {
    console.error(`   ✗ Failed to import ${pageLabel}:`, error);
    throw error;
  }
}

async function importPavePage() {
  await importProductPage('pave-page', 'Pave', pavePage);
}

async function importModFactoryPage() {
  await importProductPage('mod-factory-page', 'Mod.factory', modFactoryPage);
}

/**
 * Convert a title to a URL-safe slug
 */
function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Import Journal Page content
 * Processes card patterns and upserts the journal-page entry
 */
async function importJournalPage() {
  console.log('📰 Importing Journal Page...');

  try {
    if (!journalPage) {
      console.log('   No journal page data found, skipping...');
      return;
    }

    const existingJournalPage = await strapi.db
      .query('api::journal-page.journal-page')
      .findOne({ where: {} });

    const patterns = Array.isArray(journalPage.cardPatterns)
      ? journalPage.cardPatterns
      : Array.isArray(journalPage.listingPatterns)
        ? journalPage.listingPatterns
      : [];

    const processedPatterns = [];
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      const processedPattern = {
        label: pattern.label || `Pattern ${i + 1}`,
      };

      if (!pattern.desktopImage) {
        console.warn(`   ⚠️  Pattern ${i + 1} missing desktopImage, skipping...`);
        continue;
      }

      processedPattern.desktopImage = await checkFileExistsBeforeUpload(
        pattern.desktopImage
      );

      if (pattern.mobileImage) {
        processedPattern.mobileImage = await checkFileExistsBeforeUpload(
          pattern.mobileImage
        );
      } else {
        // Fallback to desktop image if no dedicated mobile image is provided
        processedPattern.mobileImage = processedPattern.desktopImage;
      }

      processedPatterns.push(processedPattern);
    }

    const journalPageData = {
      title: journalPage.title || 'Journal',
      introText: journalPage.introText || null,
      showLocalTime:
        typeof journalPage.showLocalTime === 'boolean'
          ? journalPage.showLocalTime
          : true,
      clockTimezone: journalPage.clockTimezone || 'Australia/Brisbane',
      clockLocale: journalPage.clockLocale || 'en-AU',
      showMoreLabel: journalPage.showMoreLabel || 'Show more articles',
      defaultArticlesPerPage: journalPage.defaultArticlesPerPage || 7,
      cardPatterns: processedPatterns,
    };

    const existingDocumentId =
      existingJournalPage?.documentId || existingJournalPage?.document_id;

    try {
      if (existingDocumentId) {
        console.log('   Updating journal-page entry...');
        await strapi.documents('api::journal-page.journal-page').update({
          documentId: existingDocumentId,
          data: journalPageData,
        });
        console.log('   ✓ Journal Page updated successfully!');
        return;
      }

      console.log('   Creating journal-page entry...');
      await strapi.documents('api::journal-page.journal-page').create({
        data: journalPageData,
      });
      console.log('   ✓ Journal Page created successfully!');
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error('   ✗ Failed to import Journal Page:', error);
    throw error;
  }
}

/**
 * Import Journal Articles content
 * Upserts article entries for listing and detail pages
 */
async function importJournalArticles() {
  console.log('📝 Importing Journal Articles...');

  try {
    if (!Array.isArray(journalArticles) || journalArticles.length === 0) {
      console.log('   No journal articles data found, skipping...');
      return;
    }

    for (let i = 0; i < journalArticles.length; i++) {
      const seedArticle = journalArticles[i];
      const title = seedArticle.title?.trim();

      if (!title) {
        console.warn(`   ⚠️  Article ${i + 1} missing title, skipping...`);
        continue;
      }

      const slug = seedArticle.slug || toSlug(title);
      const heroImageDesktopPath =
        seedArticle.heroImageDesktop || seedArticle.listingThumbnailDesktop;
      const listingThumbnailDesktopPath =
        seedArticle.listingThumbnailDesktop ||
        seedArticle.heroImageDesktop ||
        null;

      if (!heroImageDesktopPath) {
        console.warn(
          `   ⚠️  Article "${title}" missing heroImageDesktop, skipping...`
        );
        continue;
      }

      if (!listingThumbnailDesktopPath) {
        console.warn(
          `   ⚠️  Article "${title}" missing listingThumbnailDesktop, skipping...`
        );
        continue;
      }

      const listingThumbnailMobilePath =
        seedArticle.listingThumbnailMobile ||
        seedArticle.heroImageMobile ||
        listingThumbnailDesktopPath;
      const heroImageMobilePath =
        seedArticle.heroImageMobile || listingThumbnailMobilePath;

      const contentBlocks = [];
      if (Array.isArray(seedArticle.contentBlocks)) {
        for (let blockIndex = 0; blockIndex < seedArticle.contentBlocks.length; blockIndex++) {
          const processedBlock = await processJournalContentBlock(
            seedArticle.contentBlocks[blockIndex]
          );
          contentBlocks.push(processedBlock);
        }
      }

      const articleData = {
        title,
        slug,
        fullIntroduction: seedArticle.fullIntroduction || null,
        listingIntroduction:
          seedArticle.listingIntroduction || seedArticle.excerpt || null,
        publishDate: seedArticle.publishDate || seedArticle.listingDate || null,
        readingTimeMinutes: seedArticle.readingTimeMinutes || null,
        isExternal: Boolean(seedArticle.isExternal),
        externalUrl: seedArticle.externalUrl || null,
        listingThumbnailDesktop: await checkFileExistsBeforeUpload(
          listingThumbnailDesktopPath
        ),
        heroImageDesktop: await checkFileExistsBeforeUpload(
          heroImageDesktopPath
        ),
        contentBlocks,
      };

      if (listingThumbnailMobilePath) {
        articleData.listingThumbnailMobile = await checkFileExistsBeforeUpload(
          listingThumbnailMobilePath
        );
      }

      if (heroImageMobilePath) {
        articleData.heroImageMobile = await checkFileExistsBeforeUpload(
          heroImageMobilePath
        );
      }

      const existing = await strapi.db
        .query('api::journal-article.journal-article')
        .findOne({
          where: { slug },
        });
      const existingDocumentId = existing?.documentId || existing?.document_id;

      try {
        if (existingDocumentId) {
          await strapi.documents('api::journal-article.journal-article').update({
            documentId: existingDocumentId,
            data: articleData,
            status: 'published',
          });
          console.log(`   ✓ Updated journal article: ${title}`);
        } else {
          await strapi.documents('api::journal-article.journal-article').create({
            data: articleData,
            status: 'published',
          });
          console.log(`   ✓ Created journal article: ${title}`);
        }
      } catch (error) {
        if (existingDocumentId) {
          console.warn(
            `   ⚠️  Could not publish update for "${title}", saving draft update...`
          );
          await strapi.documents('api::journal-article.journal-article').update({
            documentId: existingDocumentId,
            data: articleData,
          });
          console.log(`   ✓ Updated journal article draft: ${title}`);
        } else {
          console.warn(
            `   ⚠️  Could not create "${title}" as published, creating draft instead...`
          );
          await strapi.documents('api::journal-article.journal-article').create({
            data: articleData,
          });
          console.log(`   ✓ Created journal article draft: ${title}`);
        }
      }
    }
  } catch (error) {
    console.error('   ✗ Failed to import Journal Articles:', error);
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
    'mission-page': ['find', 'findOne'],
    'journal-article': ['find', 'findOne'],
    'journal-page': ['find', 'findOne'],
    'pave-page': ['find', 'findOne'],
    'mod-factory-page': ['find', 'findOne'],
  });

  // Import homepage content
  await importHomePage();

  // Import global settings
  await importGlobalSetting();

  // Import mission page
  await importMissionPage();

  // Import product pages
  await importPavePage();
  await importModFactoryPage();

  // Import journal page and articles
  await importJournalPage();
  await importJournalArticles();

  console.log('✅ Seed data import complete');
}

// Export bootstrap function
module.exports = seedPelagicApp;
