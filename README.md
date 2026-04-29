# Everlasting Vows - Wedding Website

A cinematic, deeply personal single-page wedding website built with React, TypeScript, and Vite.

## Features

- Responsive design optimized for all devices
- Cinematic storytelling experience
- RSVP functionality
- Wedding details and itinerary
- Registry information
- Local stays recommendations

## Deployment to GitHub Pages

This project is configured for deployment to GitHub Pages with the following features:

1. Automatic deployment via GitHub Actions
2. Proper SPA routing support
3. Optimized build process

### Manual Deployment Steps

1. Ensure your repository name matches the `base` path in [vite.config.ts](vite.config.ts)
2. Run the build command:
   ```bash
   npm run build
   ```
3. The built files will be in the `dist/public` directory
4. Deploy the contents of `dist/public` to your GitHub Pages

### GitHub Actions Deployment

This repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages when changes are pushed to the `main` branch:

1. Go to your repository Settings
2. Click on "Pages" in the left sidebar
3. Under "Source", select "GitHub Actions"
4. Push changes to the `main` branch to trigger automatic deployment

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `client` directory with your domain name
2. Update your DNS settings with your domain provider
3. Configure the custom domain in your repository settings under Pages

## Development

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to http://localhost:5000

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/public` directory.
## Photo Upload Backend (Home Server)

The repository includes an upload module at `server/photo-upload/index.ts` that can be used to accept guest photo uploads directly to your storage box.

### Environment variables

- `PHOTO_UPLOADS_DIR`: absolute folder where images are stored (default: `./uploads`)
- `PHOTO_UPLOAD_DB_PATH`: SQLite metadata path (default: `server/photo-upload/photo_upload.sqlite`)
- `PHOTO_UPLOAD_MAX_MB`: max upload size in MB (default: `20`)
- `PHOTO_UPLOAD_TOKEN`: optional token required in `x-upload-token` for `POST /api/upload`
- `PHOTO_ADMIN_TOKEN`: required in `x-admin-token` for admin endpoints and `/uploads/*` static file access
- `PHOTO_UPLOAD_ENABLE_UNTIL`: optional ISO datetime cutoff (for example, one week after your event); after this time upload routes return HTTP `410`

### Endpoints

- `GET /photo-upload`: simple upload page
- `GET /api/upload/status`: health/config check for upload service (includes `enabled` and `enabledUntil`)
- `POST /api/upload`: upload a single image (`multipart/form-data`, field name `photo`); returns HTTP `410` after `PHOTO_UPLOAD_ENABLE_UNTIL` passes
- `GET /api/photo-admin/uploads`: list recent uploads (admin token required)
- `GET /uploads/<filename>`: serves uploaded files (admin token required via `x-admin-token`)

> Recommendation: expose this app through Cloudflare Tunnel or Tailscale and set both `PHOTO_UPLOAD_TOKEN` and `PHOTO_ADMIN_TOKEN`.

### One-week upload window workflow

For a typical event-week flow, set `PHOTO_UPLOAD_ENABLE_UNTIL` to an ISO timestamp about 7 days after your event (for example: `2026-06-21T23:59:59Z`). Guests can upload until that time, and then upload routes automatically return `410 Gone` without needing a redeploy. You can verify the current state from `GET /api/upload/status` (`enabled` and `enabledUntil`).
