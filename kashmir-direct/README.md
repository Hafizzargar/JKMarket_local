# 🏔️ DirectFromKashmirJammu

> **The #1 marketplace for authentic Kashmiri products — connecting local farmers, artisans, and sellers directly with buyers across India and worldwide.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-blue)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-brightgreen)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8)](https://tailwindcss.com/)

---

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Admin Portal](#admin-portal)
- [Mobile App](#mobile-app)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About the Project

Kashmir Direct is a full-stack marketplace platform built specifically for Jammu & Kashmir. It allows local farmers, artisans, and sellers to list and sell authentic Kashmiri products — saffron, apples, walnuts, pashmina, handicrafts, and more — directly to buyers without middlemen.

### The Problem
- Kashmir farmers lose 40-60% profit to middlemen
- Buyers cannot verify authenticity of Kashmiri products
- No dedicated platform for J&K specific products
- Local artisans have no direct access to global buyers

### The Solution
Kashmir Direct removes middlemen completely. Sellers list products, buyers contact sellers directly via WhatsApp, and admins verify authenticity of sellers and products.

---

## ✨ Features

### For Buyers
- 🔍 Browse authentic Kashmiri products
- 🏷️ Filter by category, location, price
- 📱 Contact sellers directly via WhatsApp
- 🗺️ Location-based search (Srinagar, Pulwama, etc.)
- ⭐ View verified seller profiles

### For Sellers
- 📦 List unlimited products with images
- 📊 Seller dashboard with stats
- ✏️ Edit/delete own products
- 📱 Mobile app for on-the-go management
- 🔔 Get notified when buyers contact

### For Admin
- ✅ Verify/reject seller accounts
- 📦 Approve/reject product listings
- 👥 Manage all users
- 📊 View platform reports
- 🏷️ Manage categories

### For Super Admin
- 👮 Create and manage admin accounts
- 🔐 Set admin permissions
- 📈 Full analytics and revenue data
- ⚙️ Global app settings
- 📋 View all system activity logs
- 💾 Export data (CSV)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Website Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **Mobile App** | React Native, Expo |
| **Backend API** | Node.js, Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **File Storage** | Supabase Storage |
| **Website Deploy** | Vercel |
| **Backend Deploy** | Render |
| **Mobile Deploy** | Google Play Store + Apple App Store |

---

## 📁 Project Structure

```
kashmir-direct/
│
├── 📁 frontend/          # Next.js Website
├── 📁 mobile/            # React Native + Expo App
└── 📁 backend/           # Node.js + Express API
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

```bash
node --version    # v18 or higher
npm --version     # v8 or higher
git --version     # any version
```

### Running Locally

1. **Backend**: `cd backend && npm install && npm start`
2. **Frontend**: `cd frontend && npm install && npm run dev`
3. **Mobile**: `cd mobile && npm install && npx expo start`

---

## 🗄️ Database Setup

Run the SQL commands in `backend/database/schema.sql` in your Supabase SQL editor.

---

## 📄 License

This project is licensed under the MIT License.
