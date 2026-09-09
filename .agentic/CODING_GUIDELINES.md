---
name: coding-guidelines
description: Guidelines to write code for development of Feature/Functionality 
agent: agent
alwaysApply: true
---

# Coding Guidelines – Sapna Shri Jewellers Web App

**MANDATORY RULES** — Apply these to ALL code before writing or reviewing.

You are an expert Next.js, React, and TypeScript engineer. These rules are non-negotiable.

---

## Framework & Architecture

- **Next.js 16+ only** with App Router and Static Site Generation (`output: 'export'`)
- Use path aliases: `@/components/...`, `@/utils/...`, `@/types/...`, `@/hooks/...`
- No legacy Next.js patterns; always use current standards
- Follow SSG pattern: Pre-build data fetching via `scripts/fetch-data.ts`
- Use `generateStaticParams()` for dynamic routes
- Reference `docs/architecture.md` for system overview

## TypeScript & Type Safety

- **Never use `any` type** — Use explicit types or `unknown` with type guards
- Always use **strict mode TypeScript** (`tsconfig.json: strict: true`)
- Prefer **type imports**: `import type { Product } from "@/types/catalog"`
- Define shared types in `/types/catalog.ts`, not in component files
- Use proper generics and interfaces for complex types
- Document complex types with JSDoc comments

## File Naming & Organization

- **Pages**: descriptive, PascalCase with `.tsx` (e.g., `ProductDetails.tsx`)
- **Components**: PascalCase (e.g., `FilterPanel.tsx`, `ProductCard.tsx`)
- **Utilities**: camelCase (e.g., `calculatePrice.ts`, `sanitizeText.ts`)
- **Hooks**: `use` prefix in camelCase (e.g., `useAuth.ts`, `useCartState.ts`)
- **Types**: Always in `/types/catalog.ts` unless component-specific and non-reusable
- Keep each file focused on a single responsibility

## Styling & Tailwind CSS

- **Tailwind CSS ONLY** — No inline styles or CSS modules except in rare cases
- Use design tokens from `globals.css`: `bg-surface`, `text-primary`, `border-theme/40`
- GPU-accelerated animations: `transition-transform duration-150 ease-out`
- **No custom CSS** unless Tailwind cannot express it
- Responsive design: mobile-first approach using breakpoints (`sm:`, `md:`, `lg:`)
- **WCAG AA color contrast** minimum for all text and interactive elements

## Component Strategy

- **Server Components by default** — Zero runtime JavaScript
- Add `'use client'` ONLY when:
  - React hooks needed (`useState`, `useEffect`, `useContext`)
  - Browser events or user interaction required (inputs, toggles, clicks)
  - Accessing browser APIs
- **Never import server utilities** in client components (headers, cookies)
- Prefer composition over inheritance
- Keep components small and focused (single responsibility)

## Accessibility (a11y) – REQUIRED

- **Semantic HTML first**: `<section>`, `<nav>`, `<article>`, `<header>`, `<footer>`, `<main>`
- Never use generic `<div>` when semantic tags apply
- **All interactive elements** need `aria-label` or `aria-labelledby`
- **Buttons with icons** must include explicit `aria-label`
- **Decorative SVGs** must have `aria-hidden="true"`
- **Form inputs** must have associated `<label>` or `aria-label`
- Use `<dl>`, `<dt>`, `<dd>` for product specifications (key-value pairs)
- **Proper heading hierarchy**: H1 → H2 → H3 (never skip levels)
- All images require descriptive `alt` text (not "image" or "picture")
- Ensure **keyboard navigation** works (Tab, Enter, Escape, Arrow keys)

## SEO & Structured Data

- Add **meta tags** to all pages: `title`, `description`, `og:*` properties
- Use **H1 once per page** with main keyword
- Organize content with proper heading hierarchy (H2, H3)
- Add **JSON-LD structured data** for products, articles, breadcrumbs
- Use semantic HTML for better indexing
- Include **internal links** to related products/categories
- Optimize images with **descriptive alt text**
- Submit **sitemap.ts** updates during deployment

## Performance & Core Web Vitals

- Use `<Image>` component from Next.js (not `<img>`)
- Lazy load images by default: `priority={false}`
- Dynamic import large components: `dynamic(() => import('...'))`
- Implement **pagination or virtual scrolling** for large lists
- Use React.memo() for expensive components (profile first)
- Minimize re-renders: proper key props, dependency arrays
- Static export optimization in `next.config.ts`
- Code splitting for route-specific components
- **Optimize for LCP and CLS** (Core Web Vitals)

## Security & Data Protection

- **Never hardcode** API keys, tokens, secrets
- Use **environment variables** only (`.env.local`, `.env.production`)
- **Sanitize user input** before display (prevent XSS)
- Validate data on **client-side AND server-side**
- Use **HTTPS only** for external API calls
- Keep dependencies updated: `npm audit`
- Avoid `eval()` and dangerous functions
- Be cautious with **user-generated content**

## Error Handling & Resilience

- Implement **try-catch** for all async operations
- Provide **user-friendly error messages** (no technical jargon)
- Show **error fallback UI** with recovery action (retry, go home)
- Use **optional chaining** (`?.`) and **nullish coalescing** (`??`)
- Handle specific error types: 404, 500, network, timeout
- Log errors to monitoring service (consider Sentry, LogRocket)
- Never expose sensitive error details to users

## State Management

- Use **React Context API** for global UI state (theme, modals, notifications)
- Use **component state** (`useState`) for local UI-only state
- Use **custom hooks** to abstract complex state logic
- Avoid **prop drilling** beyond 2-3 levels (use Context instead)
- **localStorage** for persistent state (cart, wishlist, preferences)
- Implement proper **loading and error states** in data flows

## Data Fetching & API Integration

- **Build-time data**: Use `scripts/fetch-data.ts` pre-build
- **Dynamic routes**: Use `generateStaticParams()` from JSON files
- **Client-side data**: Use `fetch()` or SWR/React Query
- **All async operations** need loading states and error handling
- Cache responses in localStorage where appropriate
- Set proper **Cache-Control headers** for static assets

## Form Handling & Validation

- Use **controlled components** with `useState`
- Implement **client-side validation** with inline feedback
- Disable submit button until **form is valid**
- Show **errors near fields** using `aria-invalid` and `aria-describedby`
- Prevent **double-submission** with loading state
- Clear form state after successful submission
- Consider **React Hook Form** for complex forms

## Code Quality & Standards

- **Strictly follow ESLint rules** — No warnings or errors in CI
- Use **Prettier for formatting** (auto-formatted)
- Add **JSDoc comments** to all exported functions and components
- Use **meaningful names** (avoid abbreviations)
- Keep functions **small and focused** (single responsibility)
- Code must be **optimized for LLMs and search crawlers**
- Document API contracts and data structures

## Imports & Exports

- Prefer **named exports** for better tree-shaking
- Use **type imports**: `import type { Type } from "..."`
- Avoid **default exports** (except for pages)
- Group imports: React/Next.js → external packages → internal modules → types
- Use absolute imports with path aliases (`@/...`)

## Testing & Validation

- Before committing: `npm run build`, `npm run lint`, `npm run test`
- Check for TypeScript errors: `npx tsc --noEmit`
- Test on **mobile and desktop** screens
- Test **error scenarios** and edge cases
- Aim for **>80% code coverage** on utilities and hooks
- Test **form submission, validation, and error states**

## Git Workflow

- Use **Conventional Commits**: `feat(scope): description`
- Examples: `feat(cart): add quantity control`, `fix(checkout): handle payment errors`
- Write **clear, descriptive PR descriptions**
- Include **before/after screenshots** for UI changes
- Link PRs to related issues

---

## Quick Reference

**ALWAYS BEFORE CODING:**
- [ ] Read `docs/architecture.md`
- [ ] Review `types/catalog.ts` for existing types
- [ ] Check `utils/` for reusable functions
- [ ] Run `npm run lint` and `npm run build` before committing
- [ ] Test on mobile and desktop
- [ ] Verify accessibility with keyboard navigation

**FORBIDDEN PATTERNS:**
- ❌ Inline styles → Use Tailwind classes
- ❌ `any` type → Use explicit types
- ❌ `<div>` for interactive elements → Use semantic tags
- ❌ Hardcoded secrets → Use environment variables
- ❌ Client `'use client'` everywhere → Use Server Components by default
- ❌ Repeated code → Extract to utilities in `/utils/`
- ❌ Missing ARIA labels → Add for all interactive elements
- ❌ No error handling → Add try-catch and error UI