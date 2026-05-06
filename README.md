# FinHub Finance Dashboard

A mobile-ready finance dashboard web app built with HTML, CSS, and JavaScript.

## What is included
- Login, registration, and password reset flows
- Dashboard with summary cards, charts, transactions, and quick actions
- Profile and Settings pages
- PWA support with `manifest.json` and service worker caching
- Installable on mobile browsers

## Files
- `index.html` - main dashboard
- `login.html` - login page
- `register.html` - registration page
- `forgot-password.html` - password reset flow
- `profile.html` - profile page
- `settings.html` - settings page
- `terms.html` - terms and conditions page
- `style.css` and `auth.css` - styles
- `app.js`, `auth.js`, `dashboard.js` - application logic
- `manifest.json`, `service-worker.js`, `icon-192.svg`, `icon-512.svg` - PWA support

## Local Preview
Use a static file server to preview the app:

### Option 1: Python
1. Open a terminal in this project folder
2. Run:
   - Python 3: `python -m http.server 8000`
3. Open `http://localhost:8000` in your browser

### Option 2: Live Server extension
- Install VS Code Live Server
- Right-click `index.html` and select `Open with Live Server`

## Hosting
This is a static web app, so you can host it on any static site service:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

### GitHub Pages
1. Create a repository with this project content
2. Enable GitHub Pages from the repo settings
3. Set source to `main` branch and `/root`
4. Browse your published app URL

## Mobile app installation
Once hosted and opened in a supported browser:
- Chrome/Edge: use "Install app" or "Add to Home screen"
- Safari: use "Add to Home Screen"

## Notes
- The app stores users locally in the browser's Local Storage
- This is a static dashboard demo; no real backend is included
