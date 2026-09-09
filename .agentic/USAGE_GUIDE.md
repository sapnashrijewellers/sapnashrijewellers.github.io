# How to Use the Development Instructions

A quick visual guide to the split documentation.

---

## 📊 File Structure

```
.agentic/
├── CODING_GUIDELINES.md        (8.5 KB) — MANDATORY RULES
├── dev-instructions.md         (18.5 KB) — Implementation Guide
├── SPLIT_SUMMARY.md            (6.3 KB) — This split explanation
├── AGENTS.md                   (3.2 KB) — Agent configuration
└── ssj-context.md              (2.6 KB) — Project context
```

---

## 🚀 Workflow by Scenario

### Scenario 1: Starting a New Feature

```
┌─────────────────────────────────────────────────────────┐
│                    NEW FEATURE START                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ 1. Read CODING_GUIDELINES.md  │
            │    (5 min) ← MANDATORY        │
            │    Learn the rules            │
            └───────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ 2. Read Pre-Implementation    │
            │    Checklist                  │
            │    (dev-instructions.md)      │
            │    (2 min)                    │
            └───────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ 3. Follow Development         │
            │    Workflow (6 steps)         │
            │    (dev-instructions.md)      │
            │    (20-30 min)                │
            └───────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ 4. Reference Implementation   │
            │    Patterns & Examples        │
            │    (dev-instructions.md)      │
            │    (as needed)                │
            └───────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ DONE ✓                        │
            └───────────────────────────────┘
```

### Scenario 2: Code Review

```
┌─────────────────────────────────────────────────────────┐
│                      CODE REVIEW                        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
     ┌──────────────────────────────────────────┐
     │ Check Against CODING_GUIDELINES.md       │
     │ ✓ Framework rules correct?               │
     │ ✓ TypeScript strict?                     │
     │ ✓ Tailwind classes (no inline styles)?   │
     │ ✓ Accessibility (ARIA, semantic)?        │
     │ ✓ No forbidden patterns?                 │
     └──────────────────────────────────────────┘
                            │
                            ▼
     ┌──────────────────────────────────────────┐
     │ Check Against dev-instructions.md        │
     │ ✓ Follows implementation patterns?       │
     │ ✓ Proper error handling?                 │
     │ ✓ Good component design?                 │
     │ ✓ No anti-patterns?                      │
     │ ✓ Well documented?                       │
     └──────────────────────────────────────────┘
                            │
                            ▼
     ┌──────────────────────────────────────────┐
     │ Approve ✓ / Request Changes              │
     └──────────────────────────────────────────┘
```

### Scenario 3: Quick Reference During Coding

```
❓ "What are the rules?"
   → CODING_GUIDELINES.md (2 min)

❓ "How do I structure this?"
   → dev-instructions.md: Component Design (5 min)

❓ "Show me an example"
   → dev-instructions.md: Common Implementation Patterns (10 min)

❓ "Is this an anti-pattern?"
   → dev-instructions.md: Anti-Patterns to Avoid (2 min)

❓ "How do I handle forms?"
   → dev-instructions.md: Form Handling & Validation (10 min)
```

---

## 📖 File Content Quick Reference

### CODING_GUIDELINES.md Sections
```
1. Framework & Architecture .......................... Next.js 16+, App Router
2. TypeScript & Type Safety .......................... No `any`, strict types
3. File Naming & Organization ........................ Naming conventions
4. Styling & Tailwind CSS ............................ Tailwind only
5. Component Strategy ................................ Server Components default
6. Accessibility (a11y) – REQUIRED ................... Semantic HTML, ARIA
7. SEO & Structured Data ............................. Meta tags, JSON-LD
8. Performance & Core Web Vitals ..................... Image optimization
9. Security & Data Protection ........................ No hardcoding
10. Error Handling & Resilience ....................... try-catch, error UI
11. State Management .................................. Context API
12. Data Fetching & API Integration .................. Build-time vs client
13. Form Handling & Validation ........................ Controlled components
14. Code Quality & Standards .......................... ESLint, Prettier, JSDoc
15. Imports & Exports ................................. Named exports, path aliases
16. Testing & Validation .............................. Pre-commit checks
17. Git Workflow ....................................... Conventional Commits
18. Quick Reference .................................... ALWAYS checklist
19. Forbidden Patterns ................................. Anti-patterns list
```

### dev-instructions.md Sections
```
1. Pre-Implementation Checklist ...................... What to read/prepare
2. Development Workflow ............................... 6-step process
3. Detailed Implementation Guidance .................. 19+ subsections with examples
4. Common Implementation Patterns ..................... 3+ real code examples
5. Anti-Patterns to Avoid ............................. 14 common mistakes
6. Resources & References ............................. Documentation links
```

---

## 🎯 Key Principles

### CODING_GUIDELINES.md is:
- **Concise** — One line or short bullet per rule
- **Mandatory** — Apply to ALL code (`alwaysApply: true`)
- **Complete** — Covers all critical areas
- **Quick reference** — Read in 5-10 minutes
- **Rules-focused** — "Thou shalt..." / "Thou shalt not..."

### dev-instructions.md is:
- **Comprehensive** — Detailed guidance with examples
- **Workflow-focused** — Step-by-step development process
- **Code-rich** — Every section has working examples
- **Developer-friendly** — Easy to follow and reference
- **Pattern-oriented** — Shows the "how" not just "what"

---

## ✅ Best Practices

**DO:**
✅ Read CODING_GUIDELINES.md before starting any feature
✅ Use dev-instructions.md as a reference while coding
✅ Follow the 6-step development workflow
✅ Check code against both files during review
✅ Use code examples from dev-instructions.md as templates
✅ Refer to anti-patterns to avoid common mistakes

**DON'T:**
❌ Skip CODING_GUIDELINES.md — It's mandatory
❌ Use inline styles or hardcoded values
❌ Ignore accessibility requirements
❌ Copy-paste code without understanding it
❌ Skip error handling or loading states
❌ Use `any` type or ignore TypeScript errors

---

## 🤖 For AI Agents

When an AI agent is working on a feature:

1. **Always read CODING_GUIDELINES.md first** — Understand mandatory constraints
2. **Follow dev-instructions.md workflow** — Structure the work properly
3. **Reference code examples** — Use proven patterns from dev-instructions.md
4. **Check anti-patterns** — Avoid common mistakes
5. **Validate against both files** — Ensure compliance before submitting

---

## 📚 When to Reference Each File

| Task | File | Section | Time |
|------|------|---------|------|
| Starting a feature | dev-instructions | Pre-Implementation | 2 min |
| Learning rules | CODING_GUIDELINES | All sections | 5-10 min |
| Component design | dev-instructions | Component Design | 10 min |
| Accessibility | CODING_GUIDELINES | a11y section | 5 min |
| Form implementation | dev-instructions | Form Handling | 15 min |
| Error handling | dev-instructions | Error Handling | 10 min |
| Code review | CODING_GUIDELINES | All sections | 10-15 min |
| Code review | dev-instructions | Anti-patterns | 5 min |
| Quick reference | CODING_GUIDELINES | Quick Reference | 1 min |
| State management | dev-instructions | State Management | 10 min |
| Performance tuning | dev-instructions | Performance Optimization | 15 min |

---

## 📞 Questions & Answers

**Q: Should I read both files every time?**
A: No. Read CODING_GUIDELINES.md once (mandatory). Then reference sections as needed.

**Q: Which file is more important?**
A: CODING_GUIDELINES.md — It contains the mandatory rules. dev-instructions.md is the guide.

**Q: Can I skip CODING_GUIDELINES.md?**
A: No. It's marked `alwaysApply: true` for a reason.

**Q: Where do I find code examples?**
A: In dev-instructions.md under "Common Implementation Patterns" and detailed sections.

**Q: How do I know if I'm breaking a rule?**
A: Check CODING_GUIDELINES.md "Forbidden Patterns" or dev-instructions.md "Anti-Patterns to Avoid"

**Q: What if I don't find what I need?**
A: Check SPLIT_SUMMARY.md to understand the split, then search both files systematically.

---

## 🔗 File References

- **CODING_GUIDELINES.md** → Standalone (no dependencies)
- **dev-instructions.md** → References CODING_GUIDELINES.md at top
- **SPLIT_SUMMARY.md** → Explains the relationship between files
- **docs/architecture.md** → System design (referenced by both)
- **types/catalog.ts** → Type definitions (referenced by both)

---

**Last Updated:** 2026-09-09
**Status:** Production Ready ✓
