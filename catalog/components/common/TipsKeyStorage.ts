const DAY = 24 * 60 * 60 * 1000;

export function setWithExpiry<T>(key: string, value: T, ttl = DAY) {
  const record = {
    value,
    expiresAt: Date.now() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(record));
}

export function getWithExpiry<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const record = JSON.parse(raw);
    if (Date.now() > record.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return record.value as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
