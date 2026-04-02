# My Investment Port - Project Context

Project-specific details for development, architecture, and maintenance.

## Core Stack
- **Frontend:** React 18, Tailwind CSS 4, Vite
- **Design:** Sovereign Design System (Dark mode, Glassmorphism)
- **Data:** Google Sheets via GAS (Google Apps Script) endpoints
- **State:** Zustand (`usePortfolioStore`)
- **Charts:** Chart.js (via `ChartCanvas` wrapper)

## Development Setup
- **Server:** `npm run dev`
- **Port:** 5173
- **Local URL:** `http://localhost:5173`
- **Host (iPad/iPhone):** `npm run dev -- --host` (Use WiFi IP)

## Project Structure
- `src/components/ui/` — Base primitives
- `src/features/` — Business logic and feature-specific UI
- `src/data/` — Data layer and configuration
- `src/pages/` — Route-level containers

## Key Pages
- **Overview** — Performance & Summary
- **Holdings** — Stock list & details
- **Passive Income** — Dividend tracker
- **Tax** — Thai PND.90/91 calculation
- **Planning** — Investment goals
- **RMF** — RMF/SSF/ThaiESG tracker

## Maintenance & Backups
- **Command:** `npm run backup`
- **Output:** `backups/YYYY-MM-DD/` (contains 5 JSON files)
- **Sources:** Google Sheet tabs (Holdings, Dividends, Sectors, Tax, RMF)
- **Schedule:** 22:00 via LaunchAgent
