# Code Deletion Log

## [2026-04-27] Frontend Refactoring Session

### Unused Hooks Removed

1. **useRateLimit.ts** (140 lines)
   - File: `frontend/src/hooks/useRateLimit.ts`
   - Reason: Dead code - no references found in any components
   - Purpose: Managed client-side rate limit countdown state
   - Status: Completely unused

2. **useValidationMessages.ts** (61 lines)
   - File: `frontend/src/hooks/useValidationMessages.ts`
   - Reason: Dead code - only internal hook `useValidationSchemas` used, but unused externally
   - Purpose: Provided memoized validation messages and schemas
   - Status: Completely unused

3. **useLogout.ts** (32 lines)
   - File: `frontend/src/hooks/useLogout.ts`
   - Reason: Dead code - no references found in any components
   - Purpose: Mutation hook for logout functionality
   - Status: Completely unused

### Unused CSS Modules Deleted

1. **CrFilter.module.css** (3 lines)
   - File: `frontend/src/components/cr/CrFilter.module.css`
   - Content: Single unused class `.filter { margin-bottom: 24px; }`
   - Reason: Component uses Tailwind classes directly, CSS module not imported
   - Status: Dead code

2. **CrTable.module.css** (3 lines)
   - File: `frontend/src/components/cr/CrTable.module.css`
   - Content: Single unused class `.table { background: white; }`
   - Reason: Component uses Tailwind classes, CSS module not imported
   - Status: Dead code

3. **CustomerSidebar.module.css** (3 lines)
   - File: `frontend/src/components/customer/CustomerSidebar.module.css`
   - Content: Single unused class `.sidebar { padding: 16px 0; }`
   - Reason: Component uses Tailwind classes, CSS module not imported
   - Status: Dead code

### Code Quality Issues Fixed

#### CrCard.tsx
- **Removed unused type:** `ActorType = "customer" | "pm" | "admin"`
- **Removed unused prop:** `actorType?: ActorType` from `CrCardProps` interface
- **Reason:** Prop was accepted but never used in component logic
- **Impact:** Cleaner component signature, reduces prop confusion

#### CrFilterBar.tsx
- **Removed unused type:** `ActorType = "customer" | "pm" | "admin"`
- **Removed unused prop:** `actorType?: ActorType` from `CrFilterBarProps` interface
- **Reason:** Prop was accepted but never used in component logic
- **Impact:** Simplified component interface, improves maintainability

#### CrDetailModal.css
- **Reformatted:** Converted hex color codes to RGB equivalents with Tailwind comments
- **Purpose:** Better alignment with Tailwind design system
- **Note:** CSS remains as-is because it contains ReactQuill-specific selectors that cannot be converted to Tailwind utility classes. ReactQuill generates markup dynamically, so these styles must remain in CSS.

### Impact Summary

**Files Deleted:** 6
- Unused hooks: 3
- Unused CSS modules: 3

**Lines of Code Removed:** 242 lines
- useRateLimit.ts: 140 lines
- useValidationMessages.ts: 61 lines
- useLogout.ts: 32 lines
- CSS modules: 9 lines (3 + 3 + 3)

**Files Modified:** 3
- CrCard.tsx: Removed unused ActorType and prop
- CrFilterBar.tsx: Removed unused ActorType and prop
- CrDetailModal.css: Reformatted for clarity

**Dependencies Removed:** 0 (no package.json changes needed)

**Bundle Size Impact:** ~2-3 KB reduction from removed unused code

### Testing Performed

✅ Verified no references to deleted hooks in codebase
✅ Confirmed CSS modules were not imported by components
✅ CrCard component renders correctly without actorType prop
✅ CrFilterBar component functions properly without actorType prop
✅ CrDetailModal.css styles still apply correctly with reformatted code

### Tailwind Migration Notes

- **CrDetailModal.css:** Cannot be migrated to Tailwind because:
  - Contains ReactQuill-generated element selectors (`.ql-editor`, `.ql-container`)
  - ReactQuill HTML is generated dynamically, not controllable via Tailwind classes
  - Must remain as custom CSS for styling dynamic content

- **Remaining components:** Already use inline Tailwind utility classes
  - CrCard.tsx: Uses Tailwind classes (e.g., `bg-white`, `rounded-lg`, `hover:shadow-md`)
  - CrFilterBar.tsx: Uses Tailwind classes (e.g., `flex`, `items-center`, `bg-gray-50`)
  - CrDetailModal.tsx: Uses Tailwind classes throughout

### Checklist

- [x] All unused hooks identified and verified not in use
- [x] All unused CSS modules identified
- [x] Code quality issues addressed
- [x] No breaking changes introduced
- [x] Build verified
- [x] Deletion log created
- [x] Safe deletion performed (no risky code removed)
