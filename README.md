# Jewellery Product Catalog

This document provides a comprehensive overview of the technical architecture, core features, and integration strategies for our modern jewellery website. It is designed to serve as the primary reference for the development team, stakeholders, and AI-driven automation workflows.

**Technology Stack:** 
- Next.js - Static Site Generation (SSG)  
- React 
- Tailwind CSS 
- Firebase 
- MiniSearch 
- Sharp for image optimizations 

**Live Demo:** [https://sapnashrijewellers.in](https://sapnashrijewellers.in)

---

## Overview
This proposal outlines a modern, high-performance website designed specifically for showcasing a jewellery product catalog. The platform combines elegant visual presentation with strong SEO foundations, mobile-first design, and optimized performance to deliver a premium digital experience aligned with a luxury jewellery brand.

---

### Product Catalog & Presentation
- Elegantly presents the jewellery catalog using multiple visual layouts and views.
- Designed to highlight craftsmanship, detail, and luxury aesthetics.
- Supports curated landing pages for collections, occasions, and featured products.
- Flexible structure to scale from a small catalog to thousands of products.

---

### SEO & LLM-Friendly Architecture
- Built with a search-engine-optimized and AI-friendly content structure.
- **Custom SEO Controls**
  - User-defined page titles, meta descriptions.
  - Individual SEO metadata for every product.
- **Structured Data**
  - JSON-LD schema integration for products, categories, and listings.
  - Improved discoverability on Google Search, Google Shopping, and AI assistants.
- Optimized URLs and internal linking for better indexing and ranking.

---

### High Performance & Scalability
- Fully **statically generated** using Next.js (SSG).
- No server-side runtime dependency, ensuring:
  - Ultra-fast page loads
  - High reliability
  - Zero performance penalty during traffic spikes
- CDN-friendly deployment for global performance.

---

### Responsive & Mobile-First Design
- Optimized for **mobile, tablet, and desktop** devices.
- Mobile-first UI ensures:
  - Seamless browsing on smartphones
  - Adaptive layouts that intelligently change based on screen size
- Touch-friendly navigation and gestures for enhanced usability.

---

### Website Capabilities
- Accessible on Android, iOS, and desktop browsers.
- Optimized for fast page loads.
- App-like experience for a clean, professional feel.

---

### Live Gold & Silver Rate Integration
- Real-time gold and silver price integration.
- Rates refreshed automatically at regular intervals.
- **Push Notifications**
  - Hourly live rate updates sent to registered users.
  - Helps drive repeat engagement and timely purchase decisions.

---

### Customer Education & Engagement
- Smart **Jewellery Buying Tips** feature:
  - A subtle animated chip highlights its availability without distraction.
  - Displays curated buying tips, checklists, and best practices.
  - Enhances customer trust and informed decision-making.
- User-friendly behavior:
  - Can be closed by the customer.
  - Remains hidden for the next 24 hours once dismissed.

---
### 🌐 Commerce & Multi-Platform Integrations

| Integration Platform | Data Source/Endpoint | Sync Frequency |
| :--- | :--- | :--- |
| Google Merchant Center | `/gmc-feed.xml` | Daily |
| Meta Commerce (FB, IG, WhatsApp) | RSS XML & CSV Feeds | Scheduled / Automated |
| Pinterest Integration | Product Feed (RSS XML / CSV) | Scheduled |
| WhatsApp Business | Direct Inquiry & Catalog Sync | Real-time / Scheduled |

#### Google Merchant Center (GMC)
- Automated RSS 2.0 XML product feed generated at build time via `app/gmc-feed.xml/route.ts`.
- Mapped attributes: `<g:id>`, `<g:title>`, `<g:description>`, `<g:price>` (INR), `<g:availability>`, `<g:brand>`, and `<g:shipping>` flat-rate rules.
- Setup for GMC Scheduled Daily Fetches with zero GTIN dependency (`<g:identifier_exists>no</g:identifier_exists>`).

#### Meta Commerce, Pinterest & WhatsApp Catalog Automation
- **Multi-Platform Automated Catalog Population:** Automatically syncs and populates products to WhatsApp Business, Instagram Shop, Facebook Shop, and Pinterest using tailored RSS XML and CSV product data feeds.
- **Meta Commerce Catalog:** Scheduled sync via data feeds aligned with product routes (`/p/[id]/`) and dynamic pricing logic.
- **WhatsApp Business Catalog & Inquiry:** Catalog sync paired with direct inquiry channel via custom URLs (`https://wa.me/<number>`) carrying pre-filled, bilingual quotation requests.
- **Social Commerce Linking:** Enhanced discovery on Instagram, Facebook, and Pinterest with Open Graph `article` metadata and direct storefront catalog linking.
---
### 📍 Local SEO & Local Business Presence
- **Grounded Local Business JSON-LD:** Implemented `JewelryStore` entity schema, linking physical showroom address (Nagda, MP), operating hours, geo-coordinates, and `sameAs` social links.
- **Bilingual GEO Markup:** On-page semantic markup (`components/product/ProductGeoSpecs.tsx`) providing natural-language entity verification for AI-driven search (SearchGPT, Google Gemini Overviews).

---
### Customizable Pages & Views

#### Home Page
- Customizable top 3 banner with user provided images 
- Jewellery Type Bar:
  - Showcases jewellery for various occasions (wedding, festive, daily wear, etc.).
  - Supports hundreds of jewellery type customizations.
  - Each type leads to a dedicated landing page.
- New Arrivals section linking directly to product detail pages.
- Collection sections for curated categories and filter for Gold and Silver product categories.
- Store trust signal highlights
- Trust-focused footer highlighting store legacy and credibility.
- Extended footer with:
  - Store address and contact details
  - Social media links
  - Quick links 
- Section to highlight store promises, features, services etc.
---

#### Category Pages
- Displays all products under a specific category.
- Optimized for browsing, filtering, and SEO visibility.

---

#### Jewellery by Occasion Pages
- Dedicated pages for occasions such as:
  - Daily Wear
  - Office Wear
  - Festive Wear
  - Bridal & Wedding Collections
- Helps customers quickly discover relevant designs.
- Optimized for browsing, filtering, and SEO visibility.

---

#### Search Page
- Free-text search across the entire catalog.
- Enables fast discovery of products by name, type.
- Filter by price, type & metal type, sort by match, name & price

---

### Hallmarking Information Page
- Educates customers about:
  - What hallmarking is
  - Benefits of hallmarked jewellery
  - How to identify genuine hallmarks
- Builds trust and credibility.

---

### Wishlist
- Allows customers to save favourite items.
- Displays all wishlisted products in one place.
- Encourages repeat visits and purchase intent.

---

### About Us Page
- Highlights store legacy and brand story.
- Details store promises, services, and craftsmanship.
- Includes store location, customer testimonials, and trust indicators.

---

## Summary of Key Benefits
- Luxury-focused presentation aligned with jewellery brands.
- SEO-optimized and AI-ready architecture.
- Lightning-fast performance with static generation.
- Responsive design for all devices.
- Highly customizable and scalable for future growth.

---

## 11. Future Enhancements
### Flexible Price Calculation Strategies

#### Problem Statement:
Currently, jewellery price estimation follows a single calculation logic. This is limiting because different products require different pricing approaches such as fixed pricing, weight-based pricing, or special promotional pricing.

#### Enhancement Description:
Introduce configurable price calculation strategies at the product level:

- Fixed Price – Ideal for lightweight, designer, or promotional items.
- Weight-Based Calculation – Price derived from metal rate × weight + making charges.
- Hybrid Pricing – Combination of fixed base price + variable components.
- Special / Override Pricing – For festive offers, clearance, or exclusive collections.

#### Reason & Business Value:

- Supports real-world jewellery pricing practices.
- Improves pricing flexibility without code changes.
- Enables faster go-to-market for offers and special collections.
- Enhances transparency and trust for customers using the price estimator.

### Dedicated Admin Panel for Product Management (CRUD)

#### Problem Statement:
Currently, products are managed via Google Sheets. Many data validation rules are bypassed, leading to:

- Incorrect or inconsistent data
- Broken image references
- Human errors during editing
- Manual coordination between sheet, images, and JSON builds

#### Enhancement Description:
Build a secure Admin Dashboard for:

- Product Create, Read, Update, Delete (CRUD)
- Field-level validation (weight, metal, price, category)
- Image upload with automatic optimization and syncing
- Preview before publish
#### Reason & Business Value:

- Eliminates dependency on spreadsheets for production data.
- Reduces errors and rework.
- Improves operational efficiency for non-technical users.
- Ensures data integrity and consistent catalog quality.

### AI-Assisted Product Creation (LLM Automation)

#### Problem Statement:
Adding a new product is time-consuming and requires filling many repetitive fields manually, increasing effort and chances of error.

#### Enhancement Description:
Enable AI-powered product creation where the admin provides:

- Product name
- Weight
- Purity
- Product image

The system automatically generates:

- Product description
- Category and tags
- SEO metadata
- Estimated pricing fields
- Image alt text and captions
- Reason & Business Value:
- Dramatically reduces time to add new products.
- Ensures consistent, SEO-optimized content.
- Lowers dependency on skilled content writers.
- Makes catalog expansion fast and scalable.

**This website solution delivers a premium, future-ready digital presence designed to elevate customer experience, improve discoverability, and strengthen brand trust.**



