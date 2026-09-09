---
name: dev-instructions
description: Instructions for development of Feature/Functionality 
argument-hint: "[optional focus area]"
agent: agent
---

# Development Workflow – Feature Implementation Guide

**BEFORE STARTING:** Read [CODING_GUIDELINES.md](CODING_GUIDELINES.md) for mandatory coding standards. This guide covers the development process and detailed implementation strategies.

---

## Pre-Implementation Checklist

- [ ] Read `CODING_GUIDELINES.md` — Understand mandatory rules
- [ ] Read `docs/architecture.md` — Understand system design
- [ ] Read `AGENTS.md` — Review agent configuration
- [ ] Review `types/catalog.ts` — Check for existing type definitions
- [ ] Scan `/utils/` folder — Identify reusable utility functions
- [ ] Find similar existing components — Study patterns and conventions
- [ ] Identify affected data sources — Check `data/*.json` and API contracts
- [ ] Plan minimal, focused implementation — Sketch the feature scope
- [ ] Propose the approach — Design before coding

---

## Development Workflow

### Step 1: Understand the Requirements
- Clearly define what the feature should do
- Identify affected pages, components, and data
- List required state, API calls, and user interactions
- Sketch the component hierarchy

### Step 2: Review Existing Patterns
- Find similar features already implemented
- Study component structure and naming conventions
- Check existing utility functions to avoid duplication
- Review error handling and loading state patterns

### Step 3: Design & Plan
- Create component structure (avoid huge monolithic components)
- Define TypeScript types and interfaces
- List utility functions needed (create in `/utils/`)
- Plan data flow and state management approach
- Sketch accessibility requirements (ARIA labels, semantic HTML)

### Step 4: Implement Incrementally
- Start with component structure and props
- Add styling with Tailwind (mobile-first)
- Implement interactivity and state management
- Add data fetching and error handling
- Add accessibility features (ARIA, semantic tags)
- Add performance optimizations (lazy loading, dynamic imports)

### Step 5: Validate & Test
- Run: `npm run build` — Verify build succeeds
- Run: `npx tsc --noEmit` — Check TypeScript errors
- Run: `npm run lint` — Verify ESLint compliance
- Test: Keyboard navigation on mobile and desktop
- Test: Error scenarios and edge cases
- Test: Performance (lighthouse, Core Web Vitals)

### Step 6: Document & Commit
- Add JSDoc comments to functions and components
- Write clear commit messages (Conventional Commits)
- Create detailed PR description with before/after
- Request review from familiar team members

---

## Detailed Implementation Guidance

### TypeScript & Type Safety
- **Define types in `/types/catalog.ts`** unless component-specific
- Use **type imports**: `import type { Product } from "@/types/catalog"`
- Always specify function parameter and return types
- Use **discriminated unions** for complex state shapes
- Document complex types with JSDoc
- Example:
  ```typescript
  // types/catalog.ts
  export type FilterState = 
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'success'; data: Product[] };
  ```

### File Organization & Naming
- Keep related utilities together: `/utils/auth/`, `/utils/cart/`, `/utils/search/`
- Use **descriptive, self-documenting names**
- Avoid single-letter variables (except loop counters)
- One component per file (unless very small)
- Export as named exports for better tree-shaking

### Component Design
- **Keep components small** — Extract into separate files if >150 lines
- Use **composition** for flexible, reusable components
- Accept flexible props: `children`, `className`, `aria-*` for customization
- Document props with JSDoc:
  ```typescript
  /**
   * FilterPanel - Displays product filters
   * @param onApply - Callback when filters are applied
   * @param defaultFilters - Initial filter state
   */
  export function FilterPanel({ onApply, defaultFilters }: FilterPanelProps) {
    // ...
  }
  ```

### Styling & Responsive Design
- **Mobile-first**: Default styles for mobile, enhance with breakpoints
- Use Tailwind tokens: `bg-surface`, `text-primary`, `border-theme/40`
- GPU animations: `transition-transform duration-150 ease-out`
- Test responsive layout: 320px, 375px, 768px, 1024px, 1440px
- Ensure **touch targets ≥ 44×44px** (iOS guideline)
- Example:
  ```tsx
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map(item => <ProductCard key={item.id} {...item} />)}
  </div>
  ```

### Accessibility (a11y) Requirements
- **Always use semantic HTML**: `<section>`, `<nav>`, `<article>`, `<header>`, `<footer>`, `<main>`
- Add `aria-label` to all interactive elements:
  ```tsx
  <button 
    aria-label="Add to cart"
    onClick={handleAdd}
    className="px-4 py-2 bg-primary"
  >
    <ShoppingCartIcon />
  </button>
  ```
- Decorative SVGs get `aria-hidden="true"`:
  ```tsx
  <StarIcon aria-hidden="true" className="w-4 h-4" />
  ```
- Form inputs need labels:
  ```tsx
  <label htmlFor="search">Search products:</label>
  <input id="search" type="text" aria-label="Search" />
  ```
- Proper heading hierarchy (H1 → H2 → H3):
  ```tsx
  <h1>Product Category</h1>
  <h2>Subcategory Name</h2>
  <h3>Feature Name</h3>
  ```
- All images require `alt` text:
  ```tsx
  <Image alt="Gold ring product image" src={product.image} />
  ```

### SEO Optimization
- **Meta tags on all pages**:
  ```tsx
  export const metadata: Metadata = {
    title: "Gold Rings | Sapna Shri Jewellers",
    description: "Explore our collection of handcrafted gold rings...",
    openGraph: {
      title: "Gold Rings | Sapna Shri Jewellers",
      description: "...",
      image: "/og-image.jpg",
    },
  };
  ```
- Add **JSON-LD structured data**:
  ```tsx
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      // ...
    })}
  </script>
  ```
- Use **H1 once per page** with main keyword
- Organize with H2/H3 headings
- Add **internal links** to related products/categories

### Performance Optimization
- Use **dynamic imports** for large components:
  ```typescript
  const AdvancedFilter = dynamic(
    () => import('@/components/product/AdvancedFilter'),
    { loading: () => <Skeleton /> }
  );
  ```
- **Lazy load images**:
  ```tsx
  <Image 
    src={product.image} 
    alt={product.name}
    priority={false}  // Lazy load by default
    width={300}
    height={300}
  />
  ```
- Use **React.memo()** for expensive components (profile first):
  ```typescript
  export const ProductCard = React.memo(function ProductCard(props) {
    // Component that rerenders frequently
    return <div>...</div>;
  });
  ```
- Implement **pagination or virtual scrolling** for large lists
- Use proper **key props** and **dependency arrays** to minimize re-renders

### State Management
- Use **React Context** for global state (cart, auth, theme):
  ```typescript
  const CartContext = createContext<CartContextType | null>(null);
  
  export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    return (
      <CartContext.Provider value={{ cart, setCart }}>
        {children}
      </CartContext.Provider>
    );
  }
  ```
- Use **`useState`** for local component state
- Create **custom hooks** to abstract state logic:
  ```typescript
  export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used in CartProvider');
    return context;
  }
  ```
- Avoid **prop drilling** beyond 2-3 levels (use Context instead)
- Use **localStorage** for persistent state:
  ```typescript
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  });
  
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  ```

### Data Fetching & API Integration
- **Pre-build data**: Use `scripts/fetch-data.ts` to generate JSON artifacts
- **Dynamic routes**: Use `generateStaticParams()` with `data/*.json`:
  ```typescript
  export async function generateStaticParams() {
    const products = (await import('@/data/products.json')).default;
    return products.map(p => ({ slug: p.slug }));
  }
  ```
- **Client-side data**: Use `fetch()` with error handling:
  ```typescript
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(err => { setError(err); setLoading(false); });
  }, []);
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage retry={() => window.location.reload()} />;
  return <div>{/* render data */}</div>;
  ```
- **Cache responses** in localStorage for offline support:
  ```typescript
  const cacheKey = 'rates-data';
  const cached = localStorage.getItem(cacheKey);
  if (cached) setRates(JSON.parse(cached));
  
  fetch('/api/rates')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      setRates(data);
    });
  ```

### Form Handling & Validation
- Use **controlled components**:
  ```typescript
  const [form, setForm] = useState({ email: '', password: '' });
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }
  ```
- **Client-side validation** with inline feedback:
  ```typescript
  const errors = {
    email: !form.email ? 'Email required' : !isValidEmail(form.email) ? 'Invalid email' : '',
    password: !form.password ? 'Password required' : form.password.length < 8 ? 'Min 8 chars' : '',
  };
  
  const isValid = !Object.values(errors).some(Boolean);
  ```
- Show **errors inline** with ARIA attributes:
  ```tsx
  <div>
    <label htmlFor="email">Email:</label>
    <input
      id="email"
      type="email"
      value={form.email}
      onChange={handleChange}
      aria-invalid={!!errors.email}
      aria-describedby={errors.email ? 'email-error' : undefined}
    />
    {errors.email && <span id="email-error" className="text-red-500">{errors.email}</span>}
  </div>
  ```
- **Disable submit** until form is valid:
  ```tsx
  <button disabled={!isValid} onClick={handleSubmit}>
    Submit
  </button>
  ```
- **Prevent double-submission**:
  ```typescript
  const [submitting, setSubmitting] = useState(false);
  
  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await api.submitForm(form);
      setForm({ email: '', password: '' });
    } finally {
      setSubmitting(false);
    }
  }
  ```

### Error Handling & Error Boundaries
- Implement **try-catch** for async operations:
  ```typescript
  async function fetchData() {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error('Fetch failed:', error);
      throw new Error('Failed to load data');
    }
  }
  ```
- Create **error boundary** for React rendering errors:
  ```typescript
  export class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
    state = { hasError: false };
    
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    
    componentDidCatch(error: Error) {
      console.error('Render error:', error);
    }
    
    render() {
      if (this.state.hasError) {
        return (
          <div className="p-4 border border-red-500 bg-red-50">
            <h2>Something went wrong</h2>
            <button onClick={() => window.location.reload()}>Reload Page</button>
          </div>
        );
      }
      return this.props.children;
    }
  }
  ```
- **User-friendly error messages** (no technical jargon):
  ```typescript
  // Bad: "TypeError: Cannot read property 'map' of undefined"
  // Good: "Failed to load products. Please try again."
  ```
- Show **error recovery actions**:
  ```tsx
  <ErrorMessage 
    message="Failed to load products"
    action={<button onClick={() => refetch()}>Try Again</button>}
  />
  ```

### Utility Functions & DRY Principle
- Store **common functions** in `/utils/`:
  - Text sanitization, slug generation, price calculations
  - Date/time formatting, data transformations
  - Validation helpers, API clients
- **Never repeat code** — Extract to utilities
- Use **named exports** for better tree-shaking:
  ```typescript
  // utils/product.ts
  export function calculateDiscountedPrice(price: number, discount: number) {
    return price * (1 - discount / 100);
  }
  
  export function formatPrice(price: number, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
    }).format(price);
  }
  ```
- Document with **JSDoc and examples**:
  ```typescript
  /**
   * Calculate selling price with markup
   * @param cost - Base cost in INR
   * @param markup - Markup percentage (0-100)
   * @returns Selling price in INR
   * @example
   * calculateSellingPrice(500, 20) // 600
   */
  export function calculateSellingPrice(cost: number, markup: number): number {
    return cost * (1 + markup / 100);
  }
  ```
- **Unit test** utility functions for reliability
- Organize by feature: `/utils/auth/`, `/utils/cart/`, `/utils/search/`

### Testing Strategy
- **Unit tests**: Utility functions, hooks, business logic
- **Integration tests**: Component interactions, data flow
- **Accessibility testing**: axe-core or manual testing
- **Visual regression**: Screenshot testing for UI changes
- **Manual testing**: Mobile/desktop, different browsers
- Aim for **>80% coverage** on utilities and hooks

### Git Workflow & Commits
- Use **Conventional Commits**:
  - `feat(component): add new feature`
  - `fix(page): resolve bug in checkout`
  - `refactor(utils): simplify price calculation`
  - `docs(readme): update installation steps`

- Write **descriptive commit messages**
- Create **detailed PR descriptions** with before/after screenshots

---

## Common Implementation Patterns

### Dynamic Routes with Pre-build Data
```typescript
// app/p/[slug]/page.tsx
export async function generateStaticParams() {
  const products = (await import('@/data/products.json')).default;
  return products.map(p => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const products = require('@/data/products.json');
  const product = products.find((p: Product) => p.slug === params.slug);
  
  if (!product) notFound();
  
  return (
    <main>
      <h1>{product.name}</h1>
      {/* ... */}
    </main>
  );
}
```

### Reusable Component with Props & Styling
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  variant?: 'compact' | 'detailed';
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  variant = 'compact' 
}: ProductCardProps) {
  return (
    <article 
      className={`border rounded-lg p-4 ${
        variant === 'detailed' ? 'p-6 shadow-lg' : 'p-4'
      }`}
    >
      <Image 
        src={product.image} 
        alt={product.name}
        width={variant === 'detailed' ? 400 : 200}
        height={variant === 'detailed' ? 400 : 200}
        priority={false}
      />
      <h3 className="mt-3 font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600">${product.price}</p>
      {onAddToCart && (
        <button 
          onClick={() => onAddToCart(product)}
          aria-label={`Add ${product.name} to cart`}
          className="mt-4 w-full bg-primary text-white py-2 rounded"
        >
          Add to Cart
        </button>
      )}
    </article>
  );
}
```

### Custom Hook for State & Fetching
```typescript
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [url]);
  
  useEffect(() => {
    refetch();
  }, [url, refetch]);
  
  return { data, loading, error, refetch };
}
```

---

## Anti-Patterns to Avoid

- ❌ **Inline styles** — Use Tailwind classes instead
- ❌ **Hardcoded data** — Extract to `/data/` or `/utils/`
- ❌ **Repeated components** — Create reusable components
- ❌ **Missing types** — Always define proper TypeScript types
- ❌ **Using `any` type** — Be specific, use `unknown` with guards
- ❌ **No error handling** — Every async operation needs fallback UI
- ❌ **Ignoring accessibility** — Always add ARIA labels and semantic HTML
- ❌ **Huge monolithic files** — Split into smaller, focused components
- ❌ **Deep prop drilling** (3+ levels) — Use Context API instead
- ❌ **Ignoring mobile design** — Design mobile-first, then enhance
- ❌ **Premature optimization** — Profile first, then optimize
- ❌ **Ignoring SEO** — Add meta tags and structured data
- ❌ **Hardcoding secrets** — Use environment variables
- ❌ **Testing only happy paths** — Test errors, edge cases, boundaries

---

## Resources & References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Web Accessibility (WCAG 2.1)](https://www.w3.org/WAI/WCAG21/quickref)
- **Project References:**
  - [Coding Guidelines](CODING_GUIDELINES.md) ← **MANDATORY: Read first**
  - [Architecture Overview](docs/architecture.md)
  - [Type Definitions](types/catalog.ts)
