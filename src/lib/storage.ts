/** Reads and JSON-parses a localStorage entry, falling back silently on missing/invalid data. */
export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** JSON-serializes and writes a value to localStorage, failing silently if storage is unavailable. */
export function saveJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — fail silently, in-memory state still works this tab */
  }
}
