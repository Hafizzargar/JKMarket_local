# 🏔️ Kashmir Direct: Technical Health & Bug Audit

This document tracks identified bugs, resolved issues, and potential architectural risks within the Kashmir Direct platform.

## 🔴 CRITICAL ISSUES (Active)
1. **Cart Persistence**: Current cart state is lost on page refresh if not synced to Supabase. *Action Required: Implement server-side cart table.*
2. **Wishlist Sync**: Wishlist currently relies on a temporary state. *Action Required: Finalize `wishlist.sql` integration.*
3. **Optimistic UI Flickering**: Fast navigation between dashboard tabs sometimes shows the previous page content for a fraction of a second. *Action Required: Implement standard `SovereignLoading` bridge on all sub-routes.*

## 🟡 MINOR ISSUES (Active)
1. **Mobile Header Density**: Some dashboard headers are too tall on small devices (iPhone SE).
2. **Double Scrollbar**: On Windows browsers, some overlays (Cart/Sidebar) cause a double scrollbar effect.
3. **Form Validation Messages**: Login/Register error messages disappear too quickly.

## ✅ RESOLVED ISSUES (Fixed Today)
1. **[FIXED] Logout Ghosting**: Sidebar and "Add to Cart" icons were appearing on the home page after logout. (Resolved with `isLoggingOut` guard and Full-Screen Fixed Overlay).
2. **[FIXED] 404 Ghost UI**: Icons were overlapping the 404 message. (Resolved by restricting icons to valid portal routes).
3. **[FIXED] Auth Redirection Loop**: Browser "Back" button was causing blank screens. (Resolved with `SovereignLoading` safety return in AuthGuard).
4. **[FIXED] Password Accessibility**: Users were typing wrong passwords without knowing. (Resolved with "Show Password" toggle).
5. **[FIXED] Complex Language**: Technical terms like "Identity Handshake" and "Registry Node" were confusing. (Resolved with plain English: "Login" and "Seller Panel").
6. **[FIXED] Profile Timeout**: Slow internet was breaking the login flow. (Resolved by increasing timeout to 10s).

## 🛠️ FUTURE HARDENING PLAN
- Implement `IntersectionObserver` for product grids to improve scroll performance.
- Add "Maintenance Mode" toggle for Super Admins.
- Formalize a `useSystemStatus` hook to track global loading/error states in one place.
