---
name: seo-audit
description: Audit the SSJ website for SEO, indexing, routing, and structured-data issues
argument-hint: "[optional focus area]"
agent: agent
---

Perform an SEO audit of the current SSJ web application.

1. Read AGENTS.md first.
2. Inspect the existing routing structure.
3. Inspect metadata implementation.
4. Inspect sitemap and robots configuration.
5. Inspect canonical URLs.
6. Inspect structured data / JSON-LD.
7. Check for possible duplicate URLs.
8. Check for broken internal links.
9. Check static-generation compatibility.

Do not modify code yet.

Return:
- Problems found
- Severity
- Evidence/files involved
- Recommended fix
- Potential Google indexing impact