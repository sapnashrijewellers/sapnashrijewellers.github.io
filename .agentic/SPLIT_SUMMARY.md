# Documentation Split Summary

## Overview
The development instructions have been split into two focused, complementary files for clarity and ease of reference.

---

## File Responsibilities

### 📋 CODING_GUIDELINES.md
**Mandatory Rules** — Quick reference for ALL code (alwaysApply: true)

**Contents:**
- **Framework & Architecture** — Next.js 16+, App Router, SSG, path aliases
- **TypeScript & Type Safety** — Strict types, no `any`, type imports
- **File Naming & Organization** — Naming conventions for files
- **Styling & Tailwind** — Tailwind-only, design tokens, GPU animations
- **Component Strategy** — Server Components by default, `'use client'` rules
- **Accessibility (a11y)** — Semantic HTML, ARIA labels, keyboard navigation (REQUIRED)
- **SEO & Structured Data** — Meta tags, H1, JSON-LD, internal links
- **Performance & Core Web Vitals** — Image optimization, lazy loading, code splitting
- **Security & Data Protection** — No hardcoding, env variables, input sanitization
- **Error Handling & Resilience** — try-catch, user-friendly messages, error UI
- **State Management** — Context API, localStorage, prop drilling limits
- **Data Fetching & API** — Build-time vs client-side patterns
- **Form Handling & Validation** — Controlled components, validation with ARIA
- **Code Quality & Standards** — ESLint, Prettier, JSDoc, naming
- **Imports & Exports** — Named exports, type imports, path aliases
- **Testing & Validation** — Pre-commit checks (build, lint, test)
- **Git Workflow** — Conventional Commits format
- **Quick Reference** — ALWAYS before coding checklist
- **Forbidden Patterns** — Clear list of anti-patterns

**Use Case:** Reference FIRST before coding anything. These are the rules.

---

### 📚 dev-instructions.md
**Development Workflow & Implementation Guide** — Detailed guidance for feature development

**Contents:**
- **Pre-Implementation Checklist** — What to read and prepare
- **Development Workflow** — 6-step process (Understand → Review → Design → Implement → Validate → Document)
- **Detailed Implementation Guidance** with code examples:
  - TypeScript & Type Safety (examples with discriminated unions)
  - File Organization & Naming (folder structure patterns)
  - Component Design (composition, flexibility, JSDoc)
  - Styling & Responsive Design (Tailwind patterns, breakpoints)
  - Accessibility Requirements (semantic HTML, ARIA examples)
  - SEO Optimization (metadata, JSON-LD examples)
  - Performance Optimization (dynamic imports, React.memo, lazy loading)
  - State Management (Context patterns, custom hooks, localStorage)
  - Data Fetching & API Integration (build-time vs client-side)
  - Form Handling & Validation (controlled components, error display)
  - Error Handling & Error Boundaries (try-catch, ErrorBoundary class)
  - Utility Functions & DRY Principle (organization, JSDoc, testing)
  - Testing Strategy (unit, integration, a11y, visual regression)
  - Git Workflow & Commits (Conventional Commits with examples)
- **Common Implementation Patterns** with full code examples:
  - Dynamic Routes with Pre-build Data
  - Reusable Component with Props & Styling
  - Custom Hook for State & Fetching
- **Anti-Patterns to Avoid** — 14 common mistakes
- **Resources & References** — Links to documentation

**Use Case:** Reference during development when implementing features. Contains detailed patterns and examples.

---

## How to Use

### When Starting a New Feature
1. **Read CODING_GUIDELINES.md** — 5 min — Learn the mandatory rules
2. **Skim dev-instructions.md Pre-Implementation Checklist** — 2 min — Prepare
3. **Deep dive into relevant dev-instructions.md sections** — As needed — Reference examples

### When Code Reviewing
1. **Check against CODING_GUIDELINES.md** — Are mandatory rules followed?
2. **Check against dev-instructions.md anti-patterns** — Any common mistakes?
3. **Verify implementation patterns** — Compare to examples in dev-instructions.md

### When Debugging or Refactoring
1. **Reference CODING_GUIDELINES.md** — Ensure compliance
2. **Look up patterns in dev-instructions.md** — Find better implementations
3. **Follow development workflow** — Structure the work properly

---

## Key Improvements

### CODING_GUIDELINES.md Enhancements
✅ Added complete **Framework & Architecture** section with specifics
✅ Organized **TypeScript & Type Safety** with clear rules
✅ Added **Imports & Exports** section for consistency
✅ Expanded **Accessibility (a11y)** with REQUIRED marker
✅ Added **Quick Reference** checklist (ALWAYS before coding)
✅ Added **Forbidden Patterns** section with clear anti-patterns
✅ Organized sections by logical workflow (read top-to-bottom)

### dev-instructions.md Enhancements
✅ Added **Development Workflow** (6-step process)
✅ All sections now have **full code examples**
✅ Each section has **actionable guidance** (not just rules)
✅ Added **Common Implementation Patterns** with real code
✅ Removed redundant rules (now in CODING_GUIDELINES.md)
✅ Added **Testing Strategy** section
✅ Expanded **Git Workflow** with examples
✅ All examples follow CODING_GUIDELINES.md requirements

---

## File Cross-References

Both files reference each other appropriately:
- **CODING_GUIDELINES.md** → Standalone mandatory rules
- **dev-instructions.md** → Starts with: "Read CODING_GUIDELINES.md for mandatory rules"
- **dev-instructions.md Resources** → Links to CODING_GUIDELINES.md with **MANDATORY: Read first**

---

## Migration Notes

If you have existing projects following the old instructions:
1. Review CODING_GUIDELINES.md for any new/changed mandatory rules
2. Check existing code against the guidelines
3. Use dev-instructions.md for new features going forward
4. No action needed for existing code (but refactor when touching it)

---

## File Sizes & Readability

| File | Purpose | Size | Read Time |
|------|---------|------|-----------|
| CODING_GUIDELINES.md | Mandatory rules (reference) | ~4KB | 5-10 min |
| dev-instructions.md | Implementation guide (detailed) | ~19KB | 20-30 min |
| **Total** | **Complete guidance** | **~23KB** | **25-40 min** |

✅ Each file has clear purpose
✅ No redundancy between files
✅ Easy to navigate
✅ Suitable for AI agents and developers
