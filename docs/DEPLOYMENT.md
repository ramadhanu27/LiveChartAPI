# 🚀 Deployment Guide - LiveChart API

## 📋 Prerequisites

- Node.js 18+ atau Bun 1.2+
- npm atau bun package manager
- Git repository

## 🌐 Deployment Platforms

### 1. Netlify (Recommended)

#### Setup Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  functions = "src"
  publish = "."

[dev]
  command = "npm start"
  port = 3000

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server/:splat"
  status = 200
```

### 2. Vercel

#### Setup Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm start",
  "installCommand": "npm install",
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### 3. Heroku

#### Setup Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main
```

#### Procfile

```
web: npm start
```

### 4. Railway

#### Setup Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link project
railway link

# Deploy
railway up
```

### 5. Render

#### Setup Render

1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Deploy

### 6. DigitalOcean App Platform

#### Setup DigitalOcean

1. Connect GitHub repository
2. Create new app
3. Configure:
   - Build command: `npm run build`
   - Run command: `npm start`
   - Port: 3000
4. Deploy

## 📦 Environment Variables

Create `.env` file untuk production:

```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

## 🔧 Build & Start Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production
npm start

# Scraping
npm run scrape
```

## ✅ Pre-Deployment Checklist

- [ ] Node.js version 18+
- [ ] All dependencies installed (`npm install`)
- [ ] Build script works (`npm run build`)
- [ ] Start script works (`npm start`)
- [ ] No console errors
- [ ] API endpoints tested locally
- [ ] Environment variables configured
- [ ] Git repository initialized
- [ ] .gitignore configured
- [ ] README.md updated

## 🧪 Testing Before Deployment

```bash
# Test build
npm run build

# Test start
npm start

# Test endpoints
curl http://localhost:3000/
curl http://localhost:3000/api/health
curl http://localhost:3000/api/anime?season=fall&year=2025
```

## 📊 Monitoring & Logs

### Netlify Logs
```bash
netlify logs --tail
```

### Vercel Logs
```bash
vercel logs
```

### Heroku Logs
```bash
heroku logs --tail
```

## 🔄 Continuous Deployment (CD)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🐛 Troubleshooting

### Error: Missing script "build"
**Solution**: Add `"build": "echo \"Build completed\""` to package.json scripts

### Error: Cannot find module
**Solution**: Run `npm install` to install dependencies

### Error: Port already in use
**Solution**: Change PORT environment variable or kill process on port 3000

### Error: Timeout on deployment
**Solution**: Increase timeout or optimize build process

## 📈 Performance Optimization

1. **Enable Caching**
   - Cache TTL: 1 hour
   - Multi-key cache system

2. **Compression**
   - Enable gzip compression
   - Minify responses

3. **Rate Limiting**
   - Implement rate limiting
   - Prevent abuse

4. **CDN**
   - Use CDN for static assets
   - Cache API responses

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] Error handling
- [ ] Logging configured
- [ ] Secrets in environment variables
- [ ] No sensitive data in logs

## 📞 Support

- GitHub Issues: [repository]/issues
- Email: contact@ramadhanu.dev
- Documentation: See README.md

## 🎉 Deployment Complete!

Your LiveChart API is now live and ready to serve requests!

**Happy deploying! 🚀**
