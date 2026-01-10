# Pelagic Strapi Cloud - CMS Knowledge Base

> Comprehensive knowledge base for the Pelagic Strapi CMS backend. This document serves as a reference for understanding the CMS structure, content types, components, and API configuration.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Content Types](#content-types)
- [Components](#components)
- [API Configuration](#api-configuration)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Integration with Frontend](#integration-with-frontend)

---

## Project Overview

**Pelagic Strapi Cloud** is a headless CMS backend built with Strapi 5.28, providing content management capabilities for the Pelagic Earth website. It uses a component-based architecture with dynamic zones for flexible content modeling.

### Key Features
- **Headless CMS**: RESTful API for content delivery
- **Component-Based**: Reusable components for consistent content structure
- **Dynamic Zones**: Flexible section ordering on pages
- **Media Management**: Built-in image/media upload and management
- **Draft/Publish**: Content versioning and publishing workflow
- **Type Generation**: TypeScript types auto-generated from schemas

---

## Tech Stack

### Core
- **Strapi**: 5.28 (headless CMS framework)
- **Node.js**: >=18.0.0 <=22.x.x (as per package.json engines)
- **Database**: 
  - Development: SQLite (`.tmp/data.db`)
  - Production: PostgreSQL or MySQL (configured via environment variables)

### Plugins
- `@strapi/plugin-cloud`: Strapi Cloud deployment support
- `@strapi/plugin-users-permissions`: User authentication and permissions

### Type Generation
- TypeScript types are auto-generated in `types/generated/`
  - `contentTypes.d.ts`: Content type schemas
  - `components.d.ts`: Component schemas

---

## Project Structure

```
pelagic-strapi-cloud/
├── config/
│   ├── admin.js              # Admin panel configuration
│   ├── api.js                # API configuration (pagination, limits)
│   ├── database.js           # Database connection configuration
│   ├── middlewares.js        # Middleware configuration
│   ├── plugins.js            # Plugin configuration
│   └── server.js             # Server configuration (host, port, keys)
├── database/
│   └── migrations/           # Database migrations
├── public/
│   ├── robots.txt
│   └── uploads/              # Uploaded media files
├── scripts/                  # Utility scripts
├── src/
│   ├── admin/                # Admin panel customization
│   │   ├── app.example.js
│   │   └── vite.config.example.js
│   ├── api/                  # API routes, controllers, services
│   │   ├── global-setting/
│   │   ├── home-page/
│   │   ├── journal-article/
│   │   └── journal-page/
│   ├── components/           # Reusable components
│   │   ├── sections/         # Section components (used in dynamic zones)
│   │   └── shared/           # Shared components
│   ├── bootstrap.js          # Bootstrap logic (empty by default)
│   ├── extensions/           # Plugin extensions
│   └── index.js              # Application entry point
├── types/
│   └── generated/            # Auto-generated TypeScript types
│       ├── components.d.ts
│       └── contentTypes.d.ts
└── package.json
```

---

## Content Types

### Single Types (One Instance)

#### 1. Global Setting (`api::global-setting.global-setting`)
**Purpose**: Site-wide settings and configuration

**Attributes**:
- `siteName` (string, required): Main site name
- `footerTagline` (string): Footer tagline text
- `socialLinks` (component, repeatable): Social media links (uses `shared.external-link`)
- `privacySlug` (uid): Privacy policy page slug
- `termsSlug` (uid): Terms of service page slug
- `mainNavigation` (json): Main navigation structure

**Access**: Single instance, no draft/publish (always published)

**API Endpoint**: `/api/global-setting`

#### 2. Home Page (`api::home-page.home-page`)
**Purpose**: Homepage content with dynamic sections

**Attributes**:
- `seo` (component, non-repeatable): SEO metadata (uses `shared.seo`)
- `sections` (dynamiczone): Flexible section ordering with components:
  - `sections.hero`
  - `sections.mission`
  - `sections.overview`
  - `sections.applications`
  - `sections.product`
  - `sections.impact`
  - `sections.milan-design-week`
  - `sections.faqs`
  - `sections.contact`
  - `sections.small-gallery`

**Access**: Single instance, no draft/publish (always published)

**API Endpoint**: `/api/home-page`

### Collection Types (Multiple Instances)

#### 3. Journal Article (`api::journal-article.journal-article`)
**Purpose**: Blog/journal articles with rich content blocks

**Attributes**:
- `slug` (uid, required, target: `articleTitle`): URL-friendly identifier
- `listingDate` (date): Publication date for listings
- `listingTitle` (string): Title shown in listings
- `listingShortDescription` (text): Short description for listings
- `listingThumbnail` (media, images only): Thumbnail image
- `articleTitle` (string, required): Full article title
- `articleIntroduction` (text): Article introduction/intro text
- `readingTimeMinutes` (integer): Estimated reading time
- `isExternal` (boolean, default: false): Whether article links externally
- `externalUrl` (string): External URL if `isExternal` is true
- `body` (dynamiczone): Rich content blocks with components:
  - `shared.media-block`
  - `shared.rich-text`
  - `shared.image-text`
  - `shared.image-pair`
  - `shared.video-block`

**Access**: Multiple instances, draft/publish enabled

**API Endpoints**:
- `GET /api/journal-articles` - List all published articles
- `GET /api/journal-articles/:id` - Get specific article
- `GET /api/journal-articles?slug=:slug` - Get article by slug

#### 4. Journal Page (`api::journal-page.journal-page`)
**Purpose**: Static journal pages (about, etc.)

**Attributes**: (See schema for full details)

**Access**: Multiple instances, draft/publish enabled

**API Endpoints**: `/api/journal-pages`

---

## Components

### Section Components (`sections/`)

Used in dynamic zones (primarily on Home Page). Each section represents a page section that can be reordered.

#### Available Section Components:

1. **Hero** (`sections.hero`)
   - `heroCopy` (text, required): Hero headline/copy
   - `desktopHeroImage` (media, images, required): Desktop hero image
   - `desktopSupportImages` (media, images, multiple): Additional desktop images
   - `mobileHeroImage` (media, images): Mobile-specific hero image
   - `mobileSupportImages` (media, images, multiple): Additional mobile images

2. **Mission** (`sections.mission`)
   - Mission section content

3. **Overview** (`sections.overview`)
   - `items` (component, repeatable): Overview items (uses `shared.overview-item`)

4. **Applications** (`sections.applications`)
   - Application showcase section

5. **Product** (`sections.product`)
   - Product information section

6. **Impact** (`sections.impact`)
   - Impact/stats section

7. **Milan Design Week** (`sections.milan-design-week`)
   - Milan Design Week specific section

8. **FAQs** (`sections.faqs`)
   - FAQ section (uses `shared.faq-item`)

9. **Contact** (`sections.contact`)
   - Contact section (uses `shared.contact-block`)

10. **Small Gallery** (`sections.small-gallery`)
    - Gallery/image showcase section

### Shared Components (`shared/`)

Reusable components used across content types and sections.

#### Available Shared Components:

1. **SEO** (`shared.seo`)
   - `metaTitle` (string, required): Page meta title
   - `metaDescription` (text, required): Meta description
   - `shareImage` (media, images): Open Graph/share image

2. **External Link** (`shared.external-link`)
   - Used for social links and external navigation

3. **FAQ Item** (`shared.faq-item`)
   - Individual FAQ question/answer pair
   - Used in `sections.faqs`

4. **Contact Block** (`shared.contact-block`)
   - Contact information block
   - Used in `sections.contact`

5. **Overview Item** (`shared.overview-item`)
   - Individual overview/feature item
   - Used in `sections.overview`

6. **Application Card** (`shared.application-card`)
   - Application/feature card component

7. **Media Block** (`shared.media-block`)
   - Media content block (images, videos)
   - Used in journal article body

8. **Rich Text** (`shared.rich-text`)
   - Rich text content block
   - Used in journal article body

9. **Image Text** (`shared.image-text`)
   - Image with text content block
   - Used in journal article body

10. **Image Pair** (`shared.image-pair`)
    - Pair of images
    - Used in journal article body

11. **Video Block** (`shared.video-block`)
    - Video content block
    - Used in journal article body

12. **Responsive Image** (`shared.responsive-image`)
    - Responsive image component with breakpoint variants

---

## API Configuration

### Default Settings
**Location**: `config/api.js`

```javascript
{
  rest: {
    defaultLimit: 25,    // Default pagination limit
    maxLimit: 100,       // Maximum allowed limit
    withCount: true,     // Include total count in responses
  }
}
```

### Server Configuration
**Location**: `config/server.js`

- **Host**: `0.0.0.0` (default, configurable via `HOST` env var)
- **Port**: `1337` (default, configurable via `PORT` env var)
- **App Keys**: Required via `APP_KEYS` environment variable (array)

### API Routes

All content types follow Strapi's standard REST API structure:

```
GET    /api/{content-type}           # List all (with pagination, filtering)
GET    /api/{content-type}/:id       # Get single item
POST   /api/{content-type}           # Create (requires auth)
PUT    /api/{content-type}/:id       # Update (requires auth)
DELETE /api/{content-type}/:id       # Delete (requires auth)
```

**Single Types** (global-setting, home-page):
- Only GET and PUT/PATCH methods available
- No collection endpoints

**Collection Types** (journal-article, journal-page):
- Full CRUD operations
- Query parameters: `?filters`, `?sort`, `?pagination`, `?populate`

### Example API Calls

```bash
# Get home page
GET /api/home-page?populate=deep

# Get global settings
GET /api/global-setting?populate=deep

# Get published journal articles with pagination
GET /api/journal-articles?publicationState=live&pagination[page]=1&pagination[pageSize]=10&populate=*

# Get article by slug
GET /api/journal-articles?filters[slug][$eq]=article-slug&populate=deep
```

---

## Development Workflow

### Prerequisites
- Node.js 18-22.x
- npm or yarn

### Installation

```bash
cd pelagic-strapi-cloud
npm install
```

### Development Commands

```bash
# Start development server with auto-reload
npm run develop
# or
npm run strapi develop

# Start production server (no auto-reload)
npm run start

# Build admin panel
npm run build

# Deploy to Strapi Cloud
npm run deploy
# or
npm run strapi deploy
```

### Access Points

- **Admin Panel**: http://localhost:1337/admin (first run creates admin user)
- **API**: http://localhost:1337/api

### Database

**Development (SQLite)**:
- Database file: `.tmp/data.db`
- Automatically created on first run
- No additional setup required

**Production**:
- Configure via `DATABASE_*` environment variables
- Supports PostgreSQL and MySQL

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2,key3,key4

# Database (Production)
DATABASE_CLIENT=postgres  # or mysql
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_password
DATABASE_SSL=false

# Strapi Cloud (if deploying)
STRAPI_DISABLE_UPDATE_NOTIFICATION=true
```

### Type Generation

TypeScript types are automatically generated when:
- Content types are created/modified
- Components are created/modified
- Schema changes are made

Types are located in `types/generated/`:
- `contentTypes.d.ts`: All content type interfaces
- `components.d.ts`: All component interfaces

### Adding New Content Types

1. Use Strapi Admin Panel:
   - Navigate to Content-Type Builder
   - Create new content type or component
   - Configure fields and relationships
   - Save (triggers type regeneration)

2. Or manually create files:
   ```
   src/api/{content-type-name}/
   ├── content-types/
   │   └── {content-type-name}/
   │       └── schema.json
   ├── controllers/
   │   └── {content-type-name}.js
   ├── routes/
   │   └── {content-type-name}.js
   └── services/
       └── {content-type-name}.js
   ```

### Adding New Components

1. Use Strapi Admin Panel:
   - Navigate to Content-Type Builder > Components
   - Create new component (sections or shared)
   - Add fields
   - Save (triggers type regeneration)

2. Or manually create JSON:
   ```
   src/components/{category}/{component-name}.json
   ```

---

## Deployment

### Strapi Cloud

This project is configured for Strapi Cloud deployment:

```bash
npm run deploy
```

**Requirements**:
- Strapi Cloud account
- Connected repository
- Environment variables configured in Strapi Cloud dashboard

### Self-Hosted Deployment

#### Using PM2 (Node.js process manager)

```bash
# Build admin panel
npm run build

# Start with PM2
pm2 start npm --name "pelagic-strapi" -- start
```

#### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 1337
CMD ["npm", "start"]
```

### Database Migrations

Migrations are stored in `database/migrations/` and run automatically on startup in production.

---

## Integration with Frontend

### Frontend Connection

The Next.js frontend (`pelagic-earth`) connects to this Strapi API:

**Development**:
- Strapi API: `http://localhost:1337/api`
- Frontend: `http://localhost:3000`

**Production**:
- Configure Strapi API URL in frontend environment variables
- Example: `NEXT_PUBLIC_STRAPI_API_URL=https://api.example.com`

### API Authentication

For public content (read-only):
- No authentication required for published content
- Use `publicationState=live` query parameter to get only published content

For protected content (create/update/delete):
- Generate API token in Strapi Admin Panel
- Include in request headers: `Authorization: Bearer <token>`

### Example Frontend Integration

```typescript
// Fetch home page with all sections
const response = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/home-page?populate=deep`,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
const homePage = await response.json();

// Fetch journal articles
const articlesResponse = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/journal-articles?publicationState=live&populate=*`
);
const articles = await articlesResponse.json();
```

### Type Safety

The frontend can import generated types:

```typescript
import type { ApiHomePageHomePage, ApiJournalArticleJournalArticle } from '../../../pelagic-strapi-cloud/types/generated/contentTypes';
```

Or use a shared types package if set up in monorepo.

---

## Best Practices

### Content Modeling
1. **Use components for reusability**: Share common structures via components
2. **Dynamic zones for flexibility**: Allow content editors to reorder sections
3. **Single types for global data**: Use for site-wide settings
4. **Collection types for dynamic content**: Use for articles, pages, etc.

### API Performance
1. **Use populate selectively**: Use `populate=deep` sparingly, specify needed relations
2. **Implement pagination**: Always paginate collection endpoints
3. **Use filters efficiently**: Strapi indexes commonly filtered fields
4. **Cache responses**: Implement caching in frontend or CDN

### Security
1. **Restrict API access**: Configure permissions in Admin Panel
2. **Use API tokens**: Generate specific tokens for different use cases
3. **Sanitize inputs**: Strapi handles this, but validate in frontend too
4. **Keep Strapi updated**: Regularly update to latest version

### Development
1. **Use draft/publish**: Test content changes before publishing
2. **Version control schemas**: Commit schema.json files
3. **Backup database**: Regular backups, especially before migrations
4. **Monitor API usage**: Track API calls and optimize as needed

---

## Troubleshooting

### Admin Panel Not Loading
- Check `APP_KEYS` environment variable is set
- Verify database connection
- Check port isn't already in use

### API Returns 404
- Verify content type is published (if draft/publish enabled)
- Check API route configuration
- Verify populate parameters if accessing relations

### Types Not Generating
- Run `npm run build` to trigger type generation
- Check for schema validation errors in admin panel
- Verify TypeScript is installed

### Database Connection Issues
- Verify database credentials in `.env`
- Check database server is running
- Verify network connectivity (for remote databases)

---

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi Cloud Documentation](https://docs.strapi.io/cloud)
- [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Content-Type Builder](https://docs.strapi.io/dev-docs/backend-customization/models)

---

## Notes

- **Version**: Strapi 5.28
- **Database**: SQLite (dev), PostgreSQL/MySQL (prod)
- **Deployment**: Configured for Strapi Cloud
- **Type Generation**: Automatic on schema changes

Last Updated: 2024