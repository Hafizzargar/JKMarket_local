# 🏔️ Obsidian Command Center: Operational Manifesto
**Project Status**: Hardened & Production Ready  
**Architecture**: Next.js + Supabase + Framer Motion (High-Fidelity)

This document outlines the governance structure, technical breakthroughs, and the "Ghost-Proof" workflow implemented for the Kashmir Direct Artisan Platform.

---

## 🏛️ Role & Governance Matrix

### 🛡️ Superadmin (The Global Auditor)
The Superadmin acts as the supreme governor of the marketplace, ensuring purity and authenticity across the valley.
- **Identity Governance**: Verifies artisan credentials and unlocks shopkeeper access.
- **Product Audit**: Reviews every listing forged in the valley. Can approve for "LIVE" status or return for "AUDIT."
- **Marketplace Surveillance**: Monitors logistics, sales, and system-wide analytics.
- **Operational Command**: Manage categories, financial thresholds, and security policies.

### 🏪 Shopkeeper / Artisan (The Producer)
Artisans manage their own boutique nodes within the VIP Tier framework.
- **The Inventory Forge**: A high-density interface for creating and updating authentic listings.
- **The Artisan Vault**: A real-time inventory management center with "Multi-Frame" visual indicators.
- **Brand Identity**: Manage shop profiles, location metadata, and artisan verification status.
- **Re-Submission Loop**: The ability to fix "Returned" products and instantly re-forge them for review.

---

## 🔄 How It Works: The "Ghost-Proof" Workflow

We have established a resilient, zero-latency cycle for product management:

1.  **Forging**: The Artisan creates a listing. It enters the vault with a **"QUEUED"** status.
2.  **Auditing**: The Superadmin reviews the listing. If purity is met, it goes **"LIVE."**
3.  **Returning**: If fixes are needed, the admin adds an **Audit Note**. The product turns **"RETURNED" (Red)**.
4.  **Exorcism (The Fix)**: The Artisan edits the product. Our "State Watcher" ensures the old rejection data is purged.
5.  **Re-Syncing**: The moment "Update" is clicked, the status snaps back to **"QUEUED"** (Amber) and the cycle repeats without data ghosting.

---

## 🛠️ Solved Bugs Hall of Fame (Hardening Phase)

| Bug ID | Code Name | Description | Resolution |
| :--- | :--- | :--- | :--- |
| **GHOST-01** | The Ghost Bug | Rejected products couldn't be re-submitted due to stale metadata. | Implemented forced metadata purge and RLS status overrides. |
| **HANG-02** | Mechanical Hang | Infinite loading spinners during image transmission. | Streamlined update logic and added step-by-step telemetry pulses. |
| **SYNC-03** | State Ghost | Editing a new product showed data from the previous one. | Implemented a React `useEffect` State Watcher for instant sync. |
| **CACHE-04** | PGRST204 | Supabase couldn't find new columns in the cache. | Executed SQL schema migrations and added cache-busting headers. |
| **METRIC-05** | Slot Blackout | License card showed "0/5" despite active inventory. | Re-anchored metrics to global total count instead of local page state. |

---

## 🖼️ Visual Architecture

### The Artisan Vault (High-Density View)
The Vault now features "Multi-Frame" indicators and kinetic hover effects to signal visual depth.

![Vault Overview](https://hqfeugrebpumkukervqz.supabase.co/storage/v1/object/public/product_images/c3d315b5-2bad-42db-80f6-b45fc7ab7e92/1778270275962_Screenshot%202026-05-02%20204219.png)

### The Inventory Forge
A hardened, sequential submission engine with real-time progress logging.

![Forge Interface](https://hqfeugrebpumkukervqz.supabase.co/storage/v1/object/public/product_images/c3d315b5-2bad-42db-80f6-b45fc7ab7e92/1778264213324_0.033662285320174234.png)

---

## 🚀 Future Roadmap
1.  **Bulk Governance**: Transitioning the vault to multi-select administrative actions.
2.  **Logistics Pulse**: Real-time shipping tracking integrated directly into the Vault rows.
3.  **Artisan Analytics**: Profit/Loss visualization for VIP Tier members.

---
*Documented by Antigravity AI for the Kashmir Direct Elite Registry.*
