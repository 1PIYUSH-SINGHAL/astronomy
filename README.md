# Welham Astronomy Club Website

Official website for the Welham Astronomy Club.  
Built as a modular, data-driven static site with clean separation between layout, logic, and content.

---

## Overview

This project includes:

- Dynamic homepage with live time, moon phase, and countdown
- Weather-integrated observation calendar
- Astrophotography album with filtering and pagination
- Streams page with live highlight + archive
- Resources page (equipment + software stack)
- About page (school, club, leadership, mission)
- Newsletter system connected to Google Sheets

The site is fully static and deployable via GitHub Pages or similar platforms.

---

## Tech Stack

Frontend:
- HTML5
- CSS3 (responsive layout)
- Vanilla JavaScript

Data Layer:
- DATA/events.js
- DATA/images.js
- DATA/streams.js

Newsletter:
- Google Apps Script (Web App)
- Google Sheets (subscriber storage)

---

## Folder Structure

assets/
  album/                      → All astrophotography images
  icons/
    about/                    → School + club logos
    person/                   → President + teacher images
    resources/
      telescope/              → Telescope images
      camera/                 → Camera images
  images/
    banner/                   → Homepage background
    gallery/                  → Placeholder images

css/
  styles.css                  → Global styles
  home.css
  about.css
  album.css
  streams.css
  resources.css

js/
  index.js
  calendar.js
  gallery.js
  album.js
  streams.js
  animations.js
  newsletter.js

DATA/
  events.js
  images.js
  streams.js
  INSTRUCTIONS.txt

---

## Calendar System

- Monthly navigation
- Event status tracking (scheduled / completed / cancelled / weather-risk)
- Open-Meteo API weather integration
- Today highlighting
- Auto event handling

Weather API:
- Latitude: 30.3165
- Longitude: 78.0322

---

## Album System

- 3x3 grid on desktop
- 3x1 layout on mobile
- Year/month filter
- Pagination
- Homepage auto-loads latest 9 images

---

## Streams System

- Single live stream highlight
- Archive layout
- YouTube thumbnail auto-generation
- 2x3 desktop layout
- 2x1 mobile layout

---

## Newsletter System

Flow:
1. User submits email
2. Data sent to Google Apps Script
3. Stored in Google Sheets
4. Emails sent via Mail Merge or Apps Script

Security:
- Email validation
- Rate limiting
- Honeypot anti-bot field
- Duplicate prevention
- Button lock during request

---

## Maintained By

Welham Astronomy Club  
Educational astronomy initiative.
