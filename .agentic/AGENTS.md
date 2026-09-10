
# SSJ Web — Agent Instructions

## Role

You are working on the SSJ jewellery website.

This repository contains the Next.js frontend only.

Do not move backend logic into this repository unless explicitly requested.

## Architecture

This is a statically generated Next.js application.

Important:
- Preserve static generation.
- Do not introduce SSR/server infrastructure without explicit approval.
- Do not introduce a database for catalogue data.
- Product data comes from generated JSON.
- Product images are hosted separately.
- avoid any legacy baggage in planning or coding

## Technology

- Next.js 16+
- TypeScript
- React
- Static generation
- GitHub Pages

## Build

The production build must remain compatible with GitHub Pages.

Existing deployment assumptions must not be broken.

Before modifying build/deployment configuration:
1. Inspect package.json.
2. Inspect next.config.
3. Inspect GitHub Actions.
4. Understand the existing static export/deployment flow.

## Data

Product data is generated externally.

Do not manually duplicate product data inside React components.

Prefer:
JSON data
    ↓
typed transformation
    ↓
components

## Images

Product images are NOT maintained in this repository.

They come from the `static` repository.

Do not copy thousands of images into this repository.

Use the established image URL/naming conventions.

## SEO

SEO is a first-class requirement.

When modifying:
- routing
- metadata
- product pages
- category pages
- canonical URLs
- sitemap
- robots.txt
- redirects
- structured data

consider Google indexing implications.

Do not remove existing SEO functionality merely to simplify implementation.

## Slugs

Product URLs must use stable, URL-safe slugs.

Do not casually change slug-generation rules because this can create:
- duplicate URLs
- 404s
- loss of indexed URLs

If changing slug logic, first investigate existing URLs and backward compatibility.

## Code style

Prefer:
- simple TypeScript
- small functions
- explicit types
- readable code
- existing project conventions

Avoid:
- unnecessary abstractions
- unnecessary dependencies
- premature optimization
- large framework additions
- Avoid code duplication even with slight variations

Utils:
- all common function used across pages like sanatize text, creating structure data, slug generation, login info etc function should not be repeat in pages and must be references from /utils folder. scan files for different objects in this folder
## Before changing code

Understand:
1. Why the existing implementation exists.
2. Which repository owns the responsibility.
3. Whether another repository depends on the behavior.
4. Whether the change affects SEO or generated data.

## Testing

At minimum:
- npm build
- relevant lint/type checks
- test affected functionality
- must meet quality standard of CodeQL, ESLint, check for duplicate code

For data/schema changes, verify consumers as well.

## Agent behavior

Do not rewrite large portions of the application when a focused change is sufficient.

Do not change architecture without explaining why.

When requirements are ambiguous, inspect existing implementation and infer
the intended behavior before introducing a new pattern.