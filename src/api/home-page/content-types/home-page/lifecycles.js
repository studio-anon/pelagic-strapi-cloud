'use strict';

// @ts-ignore - @strapi/utils is a Strapi dependency, available at runtime
const { ApplicationError } = require('@strapi/utils').errors;

/**
 * Lifecycle hooks for home-page content type
 * Ensures each section type appears only once in the dynamic zone
 */

module.exports = {
  async beforeCreate(event) {
    await validateSections(event.params.data, event);
  },

  async beforeUpdate(event) {
    await validateSections(event.params.data, event);
  },
};

/**
 * Validates sections for uniqueness and provides helpful error messages
 * @param {Object} data - The data being saved
 * @param {Object} event - The lifecycle event object
 */
async function validateSections(data, event) {
  if (!data.sections || !Array.isArray(data.sections)) {
    return; // No sections to validate
  }

  const sectionTypes = new Map(); // Map to track first occurrence index
  const duplicates = [];
  const incompleteSections = [];
  const sectionConfigErrors = [];

  for (let i = 0; i < data.sections.length; i++) {
    const section = data.sections[i];
    
    // Extract component type from section (format: "sections.hero", "sections.faqs", etc.)
    // In Strapi, dynamic zone components use __component field
    const componentType = section.__component || section.component;
    
    if (!componentType) {
      continue; // Skip if no component type found
    }

    // Check for duplicates
    if (sectionTypes.has(componentType)) {
      const firstIndex = sectionTypes.get(componentType);
      duplicates.push({
        type: componentType,
        firstIndex: firstIndex + 1, // 1-based for user-friendly message
        duplicateIndex: i + 1,
      });
    } else {
      sectionTypes.set(componentType, i);
    }

    // Check for incomplete sections (missing required fields)
    // This helps identify sections that might be duplicates with missing data
    if (componentType === 'sections.hero' && (!section.heroCopy || section.heroCopy === null)) {
      incompleteSections.push({
        type: componentType,
        index: i + 1,
        missingField: 'heroCopy',
      });
    }

    if (componentType === 'sections.articles') {
      const articleCount = getSelectedArticlesCount(section.selectedArticles);

      if (articleCount > 2) {
        sectionConfigErrors.push(
          `Articles section at position ${i + 1} has ${articleCount} selected articles. Homepage Articles supports a maximum of 2 articles.`
        );
      }
    }
  }

  // Format section names for user-friendly display
  const formatSectionName = (componentType) => {
    const name = componentType.replace('sections.', '').replace(/-/g, ' ');
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Build error messages
  const errorMessages = [];

  if (duplicates.length > 0) {
    const duplicateMessages = duplicates.map(
      dup => `${formatSectionName(dup.type)} (first at position ${dup.firstIndex}, duplicate at position ${dup.duplicateIndex})`
    ).join(', ');
    errorMessages.push(`Duplicate sections found: ${duplicateMessages}. Each section type can only appear once on the homepage. Please remove the duplicate sections.`);
  }

  if (sectionConfigErrors.length > 0) {
    errorMessages.push(sectionConfigErrors.join(' '));
  }

  // If there are duplicates AND incomplete sections, suggest removing duplicates first
  if (duplicates.length > 0 && incompleteSections.length > 0) {
    const incompleteInDuplicates = incompleteSections.filter(inc => 
      duplicates.some(dup => dup.duplicateIndex === inc.index)
    );
    
    if (incompleteInDuplicates.length > 0) {
      errorMessages.push(`Note: Some duplicate sections are also missing required fields. Please remove the duplicate sections instead of filling them in.`);
    }
  }

  if (errorMessages.length > 0) {
    const errorMessage = errorMessages.join(' ');
    
    // Use ApplicationError from @strapi/utils for user-friendly admin UI messages
    // This ensures the error is properly displayed in the Strapi admin panel
    throw new ApplicationError(errorMessage);
  }
}

function getSelectedArticlesCount(selectedArticles) {
  if (!selectedArticles) return 0;

  if (Array.isArray(selectedArticles)) {
    return selectedArticles.length;
  }

  if (Array.isArray(selectedArticles.connect)) {
    return selectedArticles.connect.length;
  }

  if (Array.isArray(selectedArticles.data)) {
    return selectedArticles.data.length;
  }

  return 0;
}
