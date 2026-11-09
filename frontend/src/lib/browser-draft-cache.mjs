/**
 * @template T
 * @param {string} key
 * @param {(value: T) => boolean} [isValid]
 * @returns {T | null}
 */
export function readBrowserDraft(key, isValid) {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(key);
    if (stored === null) return null;

    let value;
    try {
      value = JSON.parse(stored);
    } catch {
      window.localStorage.removeItem(key);
      return null;
    }

    if (isValid && !isValid(value)) {
      window.localStorage.removeItem(key);
      return null;
    }

    return value;
  } catch {
    return null;
  }
}

/** @param {string} key @param {unknown} value @returns {boolean} */
export function writeBrowserDraft(key, value) {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** @param {string} key @returns {boolean} */
export function removeBrowserDraft(key) {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
