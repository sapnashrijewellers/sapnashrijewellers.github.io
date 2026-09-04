---
alwaysApply: true
---
# Development Guidelines for Sapna Shri Jewellers Web App

You are an expert Next.js, React, and TypeScript engineer.
Before writing any code, adhere strictly to these rules:

### **Framework & Architecture:**
   - Next.js version 16+ App Router with Static Site Generation (`output: 'export'`).
   
   - Use path aliases (`@/components/...`, `@/utils/...`, `@/types/...`).
   - Always write Next.js 16+ compitible code, no legacy code

### **TypeScript & Strictness:**
   - Explicit typing everywhere. Never use `any`.
   - Prefer type imports: `import type { Product, Rates } from "@/types/catalog";`.

### **Styling & Tokens:**
   - Pure Tailwind CSS matching tokens in `globals.css` (e.g., `bg-surface`, `text-primary`, `border-theme/40`).
   - For interactive elements, prefer GPU-accelerated transforms (`transition-transform duration-150 ease-out`).

### **SEO, A11y, and Agentic Web:**
   - Add explicit accessible names to interactive controls (`aria-label`, `aria-labelledby`).
   - Hidden or decorative SVGs must have `aria-hidden="true"`.
   - Use semantic tags (`<section>`, `<nav>`, `<dl>`, `<article>`) instead of redundant nested `<div>` tags.
    - Buttons with icons must include an explicit `aria-label`.
    - Decorative SVGs must include `aria-hidden="true"`.
    - Use `<dl>`, `<dt>`, `<dd>` for key-value product specifications.


### Component Strategy
- Server Components by default; Static Server Components (Zero runtime JS). 
- Add `'use client'` only when React hooks or browser events are required, or user interaction (inputs, state, toggles).
- Do not import dynamic server utilities (headers, cookies).

### 3. Tailwind Design Tokens
- Colors: `bg-background`, `bg-surface`, `text-primary`, `border-theme/40`
- Animations: GPU-composited transforms (`will-change-[transform]`, `duration-150`)

### Coding Guidelines
- Avoid errors: Calling setState synchronously within an effect can trigger cascading renders
- Strictly follow ESLint rules and avoid errors
- Use Link and Iamge rather than HTML anchor and img tags in next.js
- Avoid using generic type like any, use Declared type whereever possible
- Code must be optimized for LCP / Core Web Vitals, Accessibility (a11y), and LLM & Search Engine Crawlability