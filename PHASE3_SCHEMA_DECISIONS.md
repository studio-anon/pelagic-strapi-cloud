# Phase 3: Schema Update Decisions

> Documentation of schema update decisions for MVP bootstrap

## Schema Review Summary

Following the plan's decision to "Start with existing schemas, add fields only if critical for MVP", we reviewed each proposed schema update and made decisions based on:
1. Frontend usage/requirement
2. MVP criticality
3. Workaround feasibility

---

## Decisions Made

### ✅ 1. FAQ Item - Email Field **ADDED**

**Status:** ✅ **IMPLEMENTED**

**Decision:** Added `email` field to `shared.faq-item` schema.

**Rationale:**
- Frontend **actively uses** email field in `FAQModal.tsx` (lines 116-126)
- Displays as: "To discuss a project or pilot, reach out via [email]"
- All 6 FAQ items have unique email addresses for different contact purposes
- Critical for user experience and lead generation

**Implementation:**
- Updated: `src/components/shared/faq-item.json`
- Added: `email` field (optional string)
- Updated: `data/data.json` to include email for all FAQ items

**Files Changed:**
- `src/components/shared/faq-item.json`
- `data/data.json`

---

### ⏭️ 2. Mission Section - TaglineText Field **DEFERRED**

**Status:** ⏭️ **DEFERRED (Not Critical for MVP)**

**Decision:** Keep existing schema with `title` and `body` fields.

**Rationale:**
- Frontend renders taglineText and fullText together in same component
- Current mapping works: `title` = taglineText, `body` = fullText
- Frontend can combine them for display if needed
- Not critical for MVP - can add later if content editors need separate fields

**Workaround:**
- Using `title` field for tagline ("Waste is in the eye of the beholder.")
- Using `body` field for main text
- Frontend can render both together or separately based on design needs

**Future Consideration:**
- Add `taglineText` as optional field in Phase 5+ if content editors request it

---

### ⏭️ 3. Impact Section - Testimonial Attribution Fields **DEFERRED**

**Status:** ⏭️ **DEFERRED (Not Critical for MVP)**

**Decision:** Keep existing `testimonialName` field (single string).

**Rationale:**
- Frontend combines name, title, and company into single string anyway
- Current data: "Philippa Abbott, Founder" (company is empty)
- Single string field is simpler and sufficient for MVP
- Can be enhanced later if needed

**Workaround:**
- Combined attribution into `testimonialName`: "Philippa Abbott, Founder"
- Frontend already displays this format
- No functionality lost

**Future Consideration:**
- Add separate `testimonialTitle` and `testimonialCompany` fields if multiple testimonials need different formatting

---

### ⏭️ 4. Application Card - Responsive Images **DEFERRED**

**Status:** ⏭️ **DEFERRED (Section Not in Bootstrap)**

**Decision:** Not addressing in Phase 3 since Applications section is not being bootstrapped yet.

**Rationale:**
- Applications section (`sections.applications`) is not included in initial bootstrap
- Schema update can be addressed when that section is migrated to Strapi
- Current static implementation works fine for now

**Future Consideration:**
- When bootstrapping Applications section, decide between:
  - Option A: Replace `image` with `shared.responsive-image` component
  - Option B: Add separate `mobileImage` field to `shared.application-card`

---

## Summary

| Schema Update | Decision | Status | Reason |
|--------------|----------|--------|--------|
| FAQ Item Email | ✅ Added | Implemented | Used in frontend, critical for UX |
| Mission TaglineText | ⏭️ Deferred | Works with current schema | Not critical, workaround sufficient |
| Impact Testimonial Fields | ⏭️ Deferred | Works with current schema | Single string sufficient for MVP |
| Applications Images | ⏭️ Deferred | Section not bootstrapped | Address when migrating section |

---

## Next Steps

1. ✅ FAQ schema updated - **Complete**
2. ✅ Data.json updated with email fields - **Complete**
3. ⏭️ Regenerate TypeScript types (will happen on next Strapi build)
4. ➡️ Proceed to Phase 4: Implement Bootstrap Script

---

## Notes

- All MVP-critical schema updates have been completed
- Remaining updates can be addressed in future phases based on content editor feedback
- Schema changes are backward compatible (all added fields are optional)
- TypeScript types will auto-regenerate when Strapi starts next time
