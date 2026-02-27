# Journal Listing Page Spec (Frontend Handoff)

## 1) Backend overview (what this repo is)

- This repository is a Strapi v5 CMS backend.
- Journal listing data comes from:
  - Single type: `journal-page` (page-level settings)
  - Collection type: `journal-article` (cards/list items)
- APIs are default Strapi core routes/controllers/services (no custom response transformation).

Important source files:
- `src/api/journal-page/content-types/journal-page/schema.json`
- `src/api/journal-article/content-types/journal-article/schema.json`
- `src/components/shared/journal-card-pattern.json`
- `src/bootstrap.js` (sets public permissions and seeds sample data)
- `config/api.js` (pagination defaults)

## 2) Page scope

Implement `/journal` page matching provided desktop/mobile design:
- Header section: page title + local time/date block.
- Card list section: article cards in descending publish date.
- "Show more" pagination behavior using CMS value `showMoreLabel`.

## 3) Data sources and API contract

Base URL:
- Local: `http://localhost:1337`
- API root: `/api`

Strapi v5 response shape:
- Uses flattened objects under `data` (not `attributes` wrapper).

### 3.1 Journal page metadata

Endpoint:

```http
GET /api/journal-page?populate[cardPatterns][populate][desktopImage][fields][0]=url&populate[cardPatterns][populate][desktopImage][fields][1]=width&populate[cardPatterns][populate][desktopImage][fields][2]=height&populate[cardPatterns][populate][mobileImage][fields][0]=url&populate[cardPatterns][populate][mobileImage][fields][1]=width&populate[cardPatterns][populate][mobileImage][fields][2]=height
```

Use fields:
- `title` (string)
- `showLocalTime` (boolean)
- `clockTimezone` (IANA timezone, default `Australia/Brisbane`)
- `clockLocale` (locale, default `en-AU`)
- `showMoreLabel` (string)
- `defaultArticlesPerPage` (int)
- `cardPatterns[]`
  - `label`
  - `desktopImage.url`, `desktopImage.width`, `desktopImage.height`
  - `mobileImage.url`, `mobileImage.width`, `mobileImage.height`

### 3.2 Journal article listing

Endpoint (initial page):

```http
GET /api/journal-articles?sort[0]=publishDate:desc&pagination[page]=1&pagination[pageSize]={defaultArticlesPerPage}&fields[0]=title&fields[1]=slug&fields[2]=publishDate&fields[3]=listingIntroduction&fields[4]=isExternal&fields[5]=externalUrl&populate[listingThumbnailDesktop][fields][0]=url&populate[listingThumbnailDesktop][fields][1]=width&populate[listingThumbnailDesktop][fields][2]=height&populate[listingThumbnailMobile][fields][0]=url&populate[listingThumbnailMobile][fields][1]=width&populate[listingThumbnailMobile][fields][2]=height
```

Use fields:
- `title`
- `slug`
- `publishDate` (ISO date)
- `listingIntroduction`
- `isExternal`
- `externalUrl`
- `listingThumbnailDesktop` (required)
- `listingThumbnailMobile` (optional)
- `meta.pagination` for "Show more"

## 4) Mapping rules to UI

## 4.1 Header

- Main title: `journalPage.title` (fallback `"Journal"`).
- Time/date block:
  - Render only if `showLocalTime === true`.
  - Compute in timezone `clockTimezone`.
  - Top line format: `HH:mm z` (example: `14:22 AEST`).
  - Second line format: `D MMMM YYYY` (example: `23 January 2026`).
  - Refresh every minute.

## 4.2 Card content

For each article:
- Month label (small uppercase): `publishDate` as `MMM YYYY` (example: `FEB 2026`).
- Title: `title`.
- Description: `listingIntroduction` (fallback `fullIntroduction` if needed).
- Visual image:
  - Desktop/tablet: `listingThumbnailDesktop`.
  - Mobile: `listingThumbnailMobile` fallback to desktop.
- Pattern background:
  - Pick from `cardPatterns[index % cardPatterns.length]`.
  - Desktop/tablet use `desktopImage`.
  - Mobile use `mobileImage` fallback to desktop.

## 4.3 Card click behavior

- If `isExternal === true` and `externalUrl` exists:
  - Open external URL in new tab.
- Else:
  - Navigate to `/journal/{slug}`.

## 5) Layout behavior

Desktop (matches provided design):
- Max-width content container, centered.
- Cards are two-column rows:
  - Left half: pattern + date/title/description content.
  - Right half: article image.
- Fixed row height per design system (image and text half equal height).

Mobile:
- Single-column stacked cards.
- Order per card:
  1. Image block
  2. Text block with pattern background and month/title/description

## 6) Pagination behavior

- Initial page size = `journalPage.defaultArticlesPerPage`.
- If `meta.pagination.page < meta.pagination.pageCount`, show button label from `journalPage.showMoreLabel`.
- On click:
  - Fetch next page with same sort/filter.
  - Append results in order.
  - Hide button when last page loaded.

## 7) Media URL handling

Strapi media `url` is relative (example `/uploads/hero_01_xxx.jpeg`).
- Build absolute URL as: `{STRAPI_BASE_URL}{url}`.
- Recommended `srcset`: use `formats.small|medium|large` when available.

## 8) Edge cases and fallbacks

- Missing `listingThumbnailMobile`: use desktop image.
- Missing `publishDate`: show no month label and keep item in API order.
- Missing `cardPatterns`:
  - Use solid neutral background token.
- `showLocalTime === false`: hide time/date block entirely.
- Empty article list: render empty state block (title + short message).

## 9) Notes on current backend reality

- Existing internal docs mention old article fields (`listingTitle`, `listingDate`), but current schema uses:
  - `title`
  - `publishDate`
  - `listingIntroduction`
  - `listingThumbnailDesktop/mobile`
- Public read permissions for `journal-page` and `journal-article` are set in `src/bootstrap.js`.

## 10) Acceptance checklist

- `/journal` renders title + optional timezone clock.
- Articles sorted by `publishDate` desc.
- Desktop and mobile layouts match provided design structure.
- Pattern backgrounds cycle consistently per card index.
- Internal/external click behavior works.
- "Show more" works until `pageCount` reached.
- No hardcoded content strings except safe fallbacks.
