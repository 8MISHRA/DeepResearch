# DeepResearch - Deployment Guide

## Quick Start

### Local Development
```bash
npm install
npm run dev
```
Visit `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

## GitHub Pages Deployment

### Method 1: GitHub Actions (Automatic) ✅ Recommended

1. **Enable GitHub Pages with Actions:**
   - Go to repository **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Deploy React app"
   git push origin main
   ```

3. **Monitor deployment:**
   - Go to **Actions** tab in your repository
   - Watch the deployment workflow
   - Once complete, visit: `https://fazil-khan03.github.io/DeepResearch/`

### Method 2: Manual Deployment with gh-pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add deploy script to package.json
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

## Verifying Deployment

After deployment, verify:

1. **Base URL works:** `https://fazil-khan03.github.io/DeepResearch/`
2. **Routes work:**
   - `https://fazil-khan03.github.io/DeepResearch/#/idempotency`
   - `https://fazil-khan03.github.io/DeepResearch/#/low-level-design`
3. **All interactive features:**
   - Payment simulation
   - Charts render correctly
   - Tab switching works
   - Navigation functions

## Troubleshooting

### Issue: Blank page after deployment
**Solution:** Check that `base: '/DeepResearch/'` is set in `vite.config.js`

### Issue: 404 on routes
**Solution:** Hash routing is already configured. Make sure you're using `/#/` in URLs.

### Issue: Assets not loading
**Solution:** Verify the base path in `vite.config.js` matches your repository name.

## Build Output

The production build creates:
- `dist/index.html` - Main HTML file
- `dist/assets/` - Bundled JS and CSS files

Total bundle size: ~390 KB (gzipped: ~126 KB)

## Environment Variables

No environment variables required for basic deployment.

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` folder with your domain
2. Configure DNS settings with your domain provider
3. Enable custom domain in GitHub Pages settings

---

**Need help?** Check the [main README](./README.md) for more details.
