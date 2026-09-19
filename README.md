# 🌿 EcoSentinel AI (Vision Monitor)
### Environmental Alerts & Rapid Response Operations Platform

> **Tagline:** *"Detect Local Problems. Alert the Community. Dispatch the Right Team. Verify the Solution."*

![EcoSentinel AI](https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview

**EcoSentinel AI** is a modern, responsive environmental monitoring and community-response web application. It integrates:

- 📡 **IoT Environmental Sensors** (Air Quality, Water Level, Flooding, Noise, Temperature)
- 🤖 **AI Anomaly & Risk Detection** with population health-risk advisories
- 📍 **GIS-Based Problem Localization** using Leaflet & OpenStreetMap
- 🚨 **Public Environmental Alerts** with affected radius visualization (e.g., 2.4 km zone)
- 📸 **Citizen Problem Reporting** with AI-assisted visual image inspection & duplicate check
- 👷 **Response Team Recommendation & Dispatch** (7 municipal crews)
- 🔍 **Before & After Resolution Proof** (photo verification + timestamped audit log)
- 🏛️ **Municipal Admin Command Center** & Telemetry Simulation Mode
- 📊 **Analytics Dashboard** (Incident trends, category donuts, SLA velocity charts)

---

## 👥 3 Human User Roles

1. **👤 Citizen:** View localized alerts, report environmental hazards with photos, and track resolution timeline with before/after photos.
2. **👷 Response Team (e.g., Arun — Drainage & Environmental Team):** View assigned field tasks, calculate distance, progress tasks (`ASSIGNED` → `ACCEPTED` → `ON THE WAY` → `WORKING` → `RESOLVED`), and upload "After" resolution proof.
3. **🏛️ Municipal Officer (Admin):** Manage IoT devices on GIS map, monitor AI risk predictions, verify citizen reports, and dispatch teams.

---

## 🏗️ Technology Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Outfit & Inter Google Fonts
- **Map:** Leaflet + OpenStreetMap (Custom animated SVG markers & radius circles)
- **Charts:** Recharts (Area, Donut, and Bar charts)
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti
- **Language Support:** English & Tamil (தமிழ்)
- **Theme:** Complete ☀️ Light Mode & 🌙 Dark Mode with persistence

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/praveenk3139/visionmonitor.git

# 2. Navigate to project directory
cd visionmonitor

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build

```bash
npm run build
```

---

## 🌐 Where & How to Deploy

### Option 1: Vercel (Recommended — Free & 1-Click)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New Project"** and select `visionmonitor`.
3. Framework Preset will automatically detect **Vite**.
4. Click **Deploy**. Your app will be live on a global CDN in under 1 minute!

### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com) and sign in.
2. Click **"Add new site"** → **"Import an existing project"** → Choose GitHub.
3. Select `praveenk3139/visionmonitor`.
4. Build command: `npm run build` | Publish directory: `dist`.
5. Click **Deploy Site**.

### Option 3: GitHub Pages
1. Install gh-pages: `npm install -D gh-pages`
2. In `vite.config.ts`, set `base: '/visionmonitor/'`
3. Add deploy script to `package.json`: `"deploy": "npm run build && gh-pages -d dist"`
4. Run `npm run deploy`.

---

## 🔄 The 9-Step Closed-Loop Lifecycle

```
SENSE (IoT Telemetry)
  ↓
PREDICT (AI Anomaly)
  ↓
LOCALIZE (GIS Zone)
  ↓
ALERT (Public Notice)
  ↓
REPORT (Citizen Photo)
  ↓
ASSIGN (Auto Dispatch)
  ↓
RESPOND (Field Action)
  ↓
PROVE (After Photo)
  ↓
RESOLVE (Verified & Safe)
```

---

## 📄 License

MIT License © 2026 EcoSentinel AI Community.
