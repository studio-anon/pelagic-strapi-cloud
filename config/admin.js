/**
 * Function to generate preview pathname based on content type and document
 */
const getPreviewPathname = (uid, { locale, document }) => {
  // Handle homepage (single type)
  if (uid === 'api::home-page.home-page') {
    return '/'; // Homepage route
  }

  // Handle journal articles (collection type)
  if (uid === 'api::journal-article.journal-article') {
    const slug = document?.slug;
    if (!slug) {
      return '/journal'; // Journal listing page (if exists)
    }
    return `/journal/${slug}`; // Individual article page
  }

  // Handle journal page (single type)
  if (uid === 'api::journal-page.journal-page') {
    return '/journal'; // Journal landing page
  }

  // Handle global setting (no preview - single type with site metadata)
  if (uid === 'api::global-setting.global-setting') {
    return null; // No preview for global settings
  }

  // Default: no preview
  return null;
};

module.exports = ({ env }) => {
  // Get environment variables
  const clientUrl = env('CLIENT_URL', 'http://localhost:3000'); // Frontend application URL
  const previewSecret = env('PREVIEW_SECRET', 'your-secret-key-change-in-production'); // Secret key for preview authentication

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: clientUrl,
        async handler(uid, { documentId, locale, status }) {
          try {
            // Fetch the document
            const document = await strapi.documents(uid).findOne({ documentId });
            
            if (!document) {
              return null;
            }

            // Generate the preview pathname
            const pathname = getPreviewPathname(uid, { locale, document });
            
            if (!pathname) {
              return null; // No preview for this content type
            }

            // Build preview URL with draft mode support
            // For Next.js, we use the draft mode route
            const previewUrl = `${clientUrl}/api/draft?secret=${previewSecret}&path=${encodeURIComponent(pathname)}`;
            
            // If status is 'published', we could return the published URL instead
            // For now, we'll always use draft mode for preview
            return previewUrl;
          } catch (error) {
            console.error(`Preview handler error for ${uid}:`, error);
            return null;
          }
        },
      },
    },
  };
};
