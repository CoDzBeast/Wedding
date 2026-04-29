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

## Isolated Guest Photo Upload (GitHub Pages + Home Server)

The `photo-upload-app/` and `server/photo-upload/` code is intentionally isolated from the main wedding SPA.

### Recommended production setup

1. Keep the wedding website on GitHub Pages (`https://www.themcnears.com`).
2. Host the Node/Express uploader on your home server with large storage (1TB+), ideally behind Cloudflare Tunnel.
3. Point a subdomain such as `https://photos.themcnears.com` to the home server service.
4. Guests use the **Upload Photos** link in the wedding site nav, which opens:
   - `https://photos.themcnears.com/photo-upload`

### Required environment variables for the uploader server

- `PHOTO_UPLOADS_DIR` — filesystem path on your home server where files are stored.
- `PHOTO_UPLOAD_DB_PATH` — SQLite database path for upload metadata.
- `PHOTO_ADMIN_TOKEN` — token required for protected admin API routes.
- `PHOTO_UPLOAD_ALLOWED_ORIGINS` — comma-separated list of allowed web origins for CORS.
  - Example: `https://www.themcnears.com,https://photos.themcnears.com`

### Optional frontend upload URL override

If you serve `photo-upload-app` from a different hostname, set this before loading `app.js`:

```html
<script>
  window.PHOTO_UPLOAD_CONFIG = {
    uploadUrl: 'https://photos.themcnears.com/api/upload'
  };
</script>
```
