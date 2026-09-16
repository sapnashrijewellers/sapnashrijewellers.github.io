const STORAGE_KEY = "recently_viewed";
const MAX_ITEMS = 10;

export function recordProductView(productId: string | number) {
  if (typeof window === "undefined") return;

  try {
    const id = productId.toString();
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing: string[] = stored ? JSON.parse(stored) : [];

    // Deduplicate and push latest to index 0
    const updated = [id, ...existing.filter((item) => item !== id)].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("recently-viewed-updated"));
  } catch (e) {
    console.error("Failed to update recently viewed:", e);
  }
}