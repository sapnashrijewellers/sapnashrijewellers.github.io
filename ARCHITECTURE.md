Logical Architecture

App shell

Pages / routes

Layouts

Components

Data sources (JSON, APIs, CMS)

Build & deploy pipeline

PWA pieces (service worker, cache, manifest)

Deployment / Runtime

Static hosting (GitHub Pages / CDN)

Browser runtime

Service worker lifecycle

# Architecture – Next.js SSG PWA

## 1. Overview
Static Site Generated Progressive Web App built using Next.js and React.

## 2. High-Level Architecture
(Insert Mermaid diagram)

## 3. Application Structure
- Pages: /pages or /app
- Components: reusable UI
- Public assets
- Styles

## 4. Routing Strategy
- File-based routing
- Dynamic routes via [slug]
- SSG via getStaticProps / generateStaticParams

## 5. PWA Architecture
- Service Worker
- Cache strategy
- Offline fallback
- Web App Manifest

## 6. Build & Deployment
- next build → static output
- GitHub Pages / CDN hosting

## 7. Key Design Decisions
(Manual – most important section)

Live rate sources:
    1. Arihant Spot: using HTTP call and parsing text block
    1. Nakoda Bullion: using socket.io as rates are coming through stream
    1. MCX: http call to json api
    1. bullions.co.in: http call and web scraping
    1. Metal Price API: using http API call and JSON parsing
    1. MMTC:using http API call and JSON parsing