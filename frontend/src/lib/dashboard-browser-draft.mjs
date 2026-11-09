/** @typedef {{startDate: string, endDate: string, rangeApplied: boolean, documentUrl: string}} DashboardDraft */

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** @param {unknown} value @returns {value is DashboardDraft} */
export function isDashboardDraft(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

  const draft = /** @type {Record<string, unknown>} */ (value);
  if (typeof draft.startDate !== "string" || typeof draft.endDate !== "string") return false;
  if (typeof draft.rangeApplied !== "boolean" || typeof draft.documentUrl !== "string") return false;
  if (draft.startDate && !isIsoDate(draft.startDate)) return false;
  if (draft.endDate && !isIsoDate(draft.endDate)) return false;

  return !draft.rangeApplied || Boolean(draft.startDate && draft.endDate && draft.startDate <= draft.endDate);
}

/** @param {DashboardDraft} draft */
export function dashboardRangeFromDraft(draft) {
  if (!isDashboardDraft(draft) || !draft.rangeApplied) return null;

  const startTime = Date.parse(`${draft.startDate}T00:00:00Z`);
  const endTime = Date.parse(`${draft.endDate}T00:00:00Z`);
  return {
    start: draft.startDate,
    end: draft.endDate,
    days: Math.floor((endTime - startTime) / 86_400_000) + 1,
  };
}
