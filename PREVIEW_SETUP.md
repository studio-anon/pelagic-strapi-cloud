# Strapi Preview Feature Configuration

This document explains the Preview feature setup for the Pelagic Strapi CMS.

## Overview

The Preview feature allows content editors to preview changes before publishing. It connects the Strapi Content Manager to the Next.js frontend so editors can see how content will appear on the live site.

**Features:**
- ✅ Preview content before publishing
- ✅ Draft mode support (view unpublished content)
- ✅ Live Preview (Growth/Enterprise plans): Edit content directly in preview
- ✅ Content source maps for in-place editing

## Configuration

### Environment Variables

Add these to your Strapi `.env` file:

```env
# Frontend application URL (where preview will be displayed)
CLIENT_URL=http://localhost:3000

# Secret key for preview authentication (must match Next.js PREVIEW_SECRET)
# Generate a secure random string for production
PREVIEW_SECRET=your-secret-key-change-in-production

# For production:
# CLIENT_URL=https://your-frontend-domain.com
# PREVIEW_SECRET=your-secure-random-string-for-production
```

### Files Modified

- **`config/admin.js`**: Preview configuration with URL generation logic
  - Preview handler for different content types
  - URL pathname generation
  - Draft mode support

## Supported Content Types

### Home Page (`api::home-page.home-page`)
- **Route**: `/` (homepage)
- **Status**: Preview ready (requires enabling `draftAndPublish` in schema)

### Journal Articles (`api::journal-article.journal-article`)
- **Route**: `/journal/[slug]` (individual article)
- **Listing Route**: `/journal` (if implemented)
- **Status**: ✅ Fully configured (draft/publish already enabled)

### Journal Page (`api::journal-page.journal-page`)
- **Route**: `/journal` (journal landing page)
- **Status**: Preview ready (requires enabling `draftAndPublish` in schema)

### Global Setting (`api::global-setting.global-setting`)
- **Preview**: Disabled (no preview needed for site metadata)

## How It Works

1. **Editor clicks "Open preview"** in Strapi admin
2. **Strapi generates preview URL** using the handler in `config/admin.js`
3. **Preview URL includes**:
   - Secret token for authentication
   - Path to the content page
   - Draft mode parameters
4. **Next.js receives request** at `/api/draft?secret=...&path=...`
5. **Draft mode is enabled** and user is redirected to the preview page
6. **Content is fetched** with `status=draft` parameter from Strapi
7. **Preview displays** the content as it will appear when published

## Enabling Draft/Publish on Home Page

If you want to enable preview for the homepage, you need to:

1. **Update the schema** (`src/api/home-page/content-types/home-page/schema.json`):
   ```json
   {
     "options": {
       "draftAndPublish": true  // Change from false to true
     }
   }
   ```

2. **Restart Strapi** to apply schema changes

3. **Publish the homepage** in Strapi admin (it will be in draft state initially)

## Testing Preview

1. **Start both servers**:
   ```bash
   # Terminal 1: Strapi
   cd pelagic-strapi-cloud
   npm run develop

   # Terminal 2: Next.js
   cd pelagic-earth
   npm run dev
   ```

2. **In Strapi Admin**:
   - Open a Journal Article (or enable draft/publish on Home Page)
   - Click "Open preview" button
   - Preview should open showing your Next.js frontend

3. **Test draft mode**:
   - Make changes to content (don't publish)
   - Preview should show draft version
   - Publish the content
   - Preview should show published version

## Troubleshooting

### Preview button is disabled
- Make sure you have **saved** your changes in the Content Manager
- Unsaved changes prevent preview from working

### Preview shows 404 or error
- Verify `CLIENT_URL` matches your Next.js dev server URL
- Check that `PREVIEW_SECRET` matches in both Strapi and Next.js `.env` files
- Ensure the preview route exists in your Next.js app

### Draft content not showing
- Verify draft mode is enabled in Next.js (check `/api/draft` route)
- Check that `status=draft` parameter is being sent to Strapi API
- Ensure the content type has `draftAndPublish: true` in its schema

### Live Preview not working
- Live Preview requires **Growth or Enterprise** Strapi plan
- Verify `strapi-encode-source-maps` header is being sent
- Check browser console for errors
- Ensure `LivePreview` component is added to root layout

## References

- [Strapi Preview Documentation](https://docs.strapi.io/cms/features/preview)
- [Next.js Draft Mode Documentation](https://nextjs.org/docs/app/api-reference/functions/draft-mode)
