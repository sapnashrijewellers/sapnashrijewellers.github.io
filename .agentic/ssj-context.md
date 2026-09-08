# SSJ — System Context

## Project

SSJ is a jewellery e-commerce/catalog platform.

The system is intentionally split into independent repositories so that
frontend, data processing, backend APIs, and static assets can evolve
independently.

## Repositories

### ssj-web
Next.js static frontend.

Responsibilities:
- Website UI
- Product catalog
- SEO
- Static generation
- Client-side interactions
- Consuming generated product JSON
- Consuming Cloudflare APIs where required

Deployment:
- GitHub Pages
- Custom domain: sapnashrijewellers.in

### ssj-dataService
Data transformation service.

Responsibilities:
- Read product/business data from Google Sheets
- Transform/validate data
- Generate consolidated JSON
- Expose/generated data for ssj-web

Primary source:
- Google Sheets

Important:
The generated JSON is a contract consumed by the frontend.
Changes to its structure must be treated as breaking changes.

### ssj-CloudFlare
Backend/API layer using Cloudflare Workers.

Responsibilities:
- Backend APIs
- Dynamic operations which should not be implemented in the static frontend
- API validation
- Security
- CORS
- Rate limiting where appropriate
- Server-side processing

### static
Dedicated static asset repository.

Responsibilities:
- Jewellery product images
- Optimized images
- Thumbnails
- WebP conversion
- Watermarking
- Image naming/slugging

The repository is exposed through GitHub Pages/CDN-style URLs.

---

# System Architecture

Google Sheets
      |
      v
ssj-dataService
      |
      v
Generated JSON
      |
      v
ssj-web
      |
      +----> static image repository
      |
      +----> ssj-CloudFlare APIs

## Core principles
- Keep repositories loosely coupled.
- Prefer explicit contracts between repositories.
- Avoid duplicating business logic.
- Do not introduce a database where JSON/static data is sufficient.
- Preserve SEO performance.
- Prefer static generation for catalogue content.
- Keep image processing separate from frontend deployment.
- Automate repetitive operations through GitHub Actions.
- Avoid unnecessary paid infrastructure.
- Prefer simple, maintainable solutions over complex abstractions.
## Technology

### Frontend:

- Next.js 16
- TypeScript
- Static generation

### Data:

- Google Sheets
- Google Apps Script / data service
- JSON

### Backend: 
Cloudflare Workers

### Assets:

- GitHub repository
- Sharp
- WebP
- Optimized images
- Thumbnails

### CI/CD:

GitHub Actions

### Hosting:

- GitHub Pages for frontend/static assets
- Cloudflare for backend APIs