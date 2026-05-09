# 🏔️ Obsidian Command Center: Operational Manifesto
**Project Status**: Hardened & Production Ready  
**Architecture**: Next.js + Supabase + Framer Motion (High-Fidelity)

This document outlines the governance structure, technical breakthroughs, and the "Ghost-Proof" workflow implemented for the Kashmir Direct Artisan Platform.

---

## 🏛️ Role & Governance Matrix

### 🛡️ Admin Portal (The Oversight Authority)
The Admin Portal is the high-security command center for the valley's supreme governors and regional managers.
- **Identity Hardening**: Multi-stage verification of artisan credentials and workshop authenticity.
- **Product Audit Forge**: A dedicated review pipeline to ensure only elite, authentic products reach the public.
- **Governance Tools**: Real-time management of categories, regional managers, and marketplace policies.
- **Regional Oversight**: Managers act as governors for specific valley nodes, handling recruitment and first-line audits.
- **System Surveillance**: Monitoring transaction health, logistics pulses, and artisan performance metrics.

### 🏪 Shopkeeper / Artisan (The Producer Hub)
The Artisan Hub is a high-density workshop for the valley's creators to forge their digital presence.
- **The Inventory Vault**: A real-time command center for managing boutique listings with "Ghost-Proof" state synchronization.
- **Boutique Identity**: Granular control over shop metadata, brand story, and location-based verification.
- **Visual Analytics**: Interactive row-based indicators for product status (Live, Queued, or Returned).
- **Commit Workflow**: A streamlined, mobile-optimized interface for updating inventory on the fly.

### 🛍️ Buyer / Customer (The Market Participant)
The Buyer experience is designed for premium, zero-friction exploration of the valley's treasures.
- **Elite Discovery**: High-fidelity search and filtering across verified artisan boutiques.
- **Auth-Gated Cart**: A resilient, persistent shopping experience that bridges identity and intent.
- **Direct Connection**: Direct access to artisan stories and authentic regional products.
- **Logistics Transparency**: Real-time visualization of the product journey from the mountain fields to their doorstep.

---

## 🔄 How It Works: The "Ghost-Proof" Workflow

We have established a resilient, zero-latency cycle for product management:

1.  **Forging**: The Artisan creates a listing. It enters the vault with a **"QUEUED"** status.
2.  **Auditing**: The Superadmin reviews the listing. If purity is met, it goes **"LIVE."**
3.  **Returning**: If fixes are needed, the admin adds an **Audit Note**. The product turns **"RETURNED" (Red)**.
4.  **Exorcism (The Fix)**: The Artisan edits the product. Our "State Watcher" ensures the old rejection data is purged.
5.  **Re-Syncing**: The moment "Update" is clicked, the status snaps back to **"QUEUED"** (Amber) and the cycle repeats without data ghosting.

---

## 🔄 How It Works: The "Legacy Forge" Careers System
We have expanded the platform with a high-fidelity recruitment architecture:
1.  **Public Showcase**: Talent can explore premium roles at `/careers` with advanced filtering.
2.  **Management Command**: Managers and Superadmins use the **"JobForge"** to draft and post vacancies.
3.  **Role Isolation**: Recruitment tools are guarded—only authorized management can access the forge.

---

## 🛠️ Solved Bugs Hall of Fame (Hardening Phase)

| Bug ID | Code Name | Description | Resolution |
| :--- | :--- | :--- | :--- |
| **GHOST-01** | The Ghost Bug | Rejected products couldn't be re-submitted due to stale metadata. | Implemented forced metadata purge and RLS status overrides. |
| **ECHO-06** | Artisan Echo | Identical seller workshops appearing multiple times on the marketplace. | Implemented a Unique ID & Shop Name Identity Guard in the fetch logic. |
| **STALL-07** | Session Stall | Logout button not purging local state, trapping users in the dashboard. | Hardened `signOut` with an "Instant State Purge" and "Full Page Reset." |
| **ID-08** | Tab Amnesia | Browser tabs showed generic titles instead of the Kashmir Direct brand. | Refactored `layout.jsx` to a Server Component to host high-ranking SEO metadata and icons. |
| **SESSION-09** | Portal Loop | Super Admin identity was trapped in a redirection loop during session refresh. | Hardened `AuthService` with sovereign loading states and explicit path guards. |
| **MOBILE-10** | Footer Drift | Mobile action footer was obscuring content or failing to trigger on artisan edits. | Implemented "isDirty" sentinel state and fixed layout rhythm in the mobile profile node. |

---

## 📅 Recent Operational Log

### 🗓️ Yesterday (May 9, 2026) - The Hardening Phase
*   **Identity Sovereignty**: Completed the production-grade stabilization of the Super Admin and Artisan identity portals. 
*   **Mobile High-Density Refactor**: Optimized the `ProfileNode` UI for mobile, ensuring a premium "artisan-creme" palette and high-density touch targets.
*   **Logistics Pulse**: Forged the `LogisticsAnimation` component—a kinetic, SVG-driven flow illustrating the journey from 🏔️ Fields to 🏡 Doorstep.
*   **Marketplace Parity**: Standardized `ProductCard` components across the marketplace to ensure visual consistency and elite performance.
*   **Auth-Gated Ecosystem**: Finalized the 'Auth-Gated' cart system and database synchronization between the identity vault and user registry.

### 🗓️ Today (May 10, 2026) - The Polish Phase
*   **Registration Forge**: Polished the artisan registration workflow (`register/page.jsx`) for zero-friction onboarding.
*   **Auth Service Finalization**: Hardened the `AuthService.js` to ensure immutable session persistence and persistent cross-tab state.
*   **Operational Manifesto**: Initialized and updated the Command Center (`what-work-we-do.md`) to maintain high-fidelity oversight of valley operations.

---

## 🖼️ Visual Architecture

### The Artisan Vault (High-Density View)
The Vault now features "Multi-Frame" indicators and kinetic hover effects to signal visual depth.

![Vault Overview](https://hqfeugrebpumkukervqz.supabase.co/storage/v1/object/public/product_images/c3d315b5-2bad-42db-80f6-b45fc7ab7e92/1778270275962_Screenshot%202026-05-02%20204219.png)

### The Legacy Forge (Careers)
A premium, glassmorphism-inspired careers page for institutional scale.

---

## 🚀 Future Roadmap
1.  **Bulk Governance**: Transitioning the vault to multi-select administrative actions.
2.  **Logistics Pulse**: Real-time shipping tracking integrated directly into the Vault rows.
3.  **Artisan Analytics**: Profit/Loss visualization for VIP Tier members.

---
*Documented by Antigravity AI for the Kashmir Direct Elite Registry.*
