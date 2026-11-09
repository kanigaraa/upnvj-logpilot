/** @param {unknown} value @param {string} sourceHash @param {boolean} approved @param {string} baselineText */
export function isWeeklyReflectionDraft(value, sourceHash, approved, baselineText) {
  if (approved || typeof value !== "object" || value === null || Array.isArray(value)) return false;

  const draft = /** @type {Record<string, unknown>} */ (value);
  return draft.source_hash === sourceHash
    && draft.baseline_text === baselineText
    && typeof draft.text === "string";
}
