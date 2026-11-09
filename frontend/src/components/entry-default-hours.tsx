"use client";

import { useEffect, useState, type FormEvent } from "react";

import { API_BASE, apiError } from "../lib/api";
import { readBrowserDraft, removeBrowserDraft, writeBrowserDraft } from "../lib/browser-draft-cache.mjs";

type DateRange = { start: string; end: string };
type DefaultSettings = {
  default_start_time: string | null;
  default_end_time: string | null;
  default_documentation_url: string | null;
};
type DefaultSettingsDraft = { startTime: string; endTime: string; documentationUrl: string };
type CachedDefaultSettings = { baseline: DefaultSettings; values: DefaultSettingsDraft };

type Props = {
  range: DateRange;
  eligibleCount: number;
  documentationEligibleCount: number;
  onApplied: () => Promise<void>;
};

const TIME_24H = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const DEFAULT_HOURS_CACHE_KEY = "logpilot.default-hours.v1";

function isDefaultSettings(value: unknown): value is DefaultSettings {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const settings = value as Record<string, unknown>;
  return ["default_start_time", "default_end_time", "default_documentation_url"]
    .every((key) => settings[key] === null || typeof settings[key] === "string");
}

function isCachedDefaultSettings(value: unknown): value is CachedDefaultSettings {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const cached = value as Record<string, unknown>;
  if (!isDefaultSettings(cached.baseline)) return false;
  if (typeof cached.values !== "object" || cached.values === null || Array.isArray(cached.values)) return false;
  const values = cached.values as Record<string, unknown>;
  return ["startTime", "endTime", "documentationUrl"].every((key) => typeof values[key] === "string");
}

function sameSettings(left: DefaultSettings, right: DefaultSettings) {
  return left.default_start_time === right.default_start_time
    && left.default_end_time === right.default_end_time
    && left.default_documentation_url === right.default_documentation_url;
}

export function EntryDefaultHours({ range, eligibleCount, documentationEligibleCount, onApplied }: Props) {
  const [settings, setSettings] = useState<DefaultSettings>({
    default_start_time: null,
    default_end_time: null,
    default_documentation_url: null,
  });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [documentationUrl, setDocumentationUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [confirming, setConfirming] = useState<"hours" | "documentation" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cacheWarning, setCacheWarning] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/entries/default-hours`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(await apiError(response, "Pengaturan jam belum dapat dibaca."));
        return response.json() as Promise<DefaultSettings>;
      })
      .then((result) => {
        if (!active) return;
        const cached = readBrowserDraft<CachedDefaultSettings>(
          DEFAULT_HOURS_CACHE_KEY,
          (value) => isCachedDefaultSettings(value) && sameSettings(value.baseline, result),
        );
        const values = cached?.values;
        setSettings(result);
        setStartTime(values?.startTime ?? result.default_start_time ?? "");
        setEndTime(values?.endTime ?? result.default_end_time ?? "");
        setDocumentationUrl(values?.documentationUrl ?? result.default_documentation_url ?? "");
      })
      .catch(() => {
        if (active) setError("Pengaturan bawaan belum dapat dibaca. Coba muat ulang halaman.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const hoursDirty = startTime !== (settings.default_start_time ?? "")
    || endTime !== (settings.default_end_time ?? "");
  const documentationDirty = documentationUrl.trim() !== (settings.default_documentation_url ?? "");
  const settingsDirty = hoursDirty || documentationDirty;

  function updateSettingsDraft(values: DefaultSettingsDraft) {
    setStartTime(values.startTime);
    setEndTime(values.endTime);
    setDocumentationUrl(values.documentationUrl);
    setError("");
    setConfirming(null);

    const baseline = settings;
    const unchanged = values.startTime === (baseline.default_start_time ?? "")
      && values.endTime === (baseline.default_end_time ?? "")
      && values.documentationUrl.trim() === (baseline.default_documentation_url ?? "");
    const cacheUpdated = unchanged
      ? removeBrowserDraft(DEFAULT_HOURS_CACHE_KEY)
      : writeBrowserDraft(DEFAULT_HOURS_CACHE_KEY, { baseline, values });
    setCacheWarning(cacheUpdated ? "" : "Cache browser tidak dapat diperbarui. Simpan pengaturan sebelum memuat ulang.");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Boolean(startTime) !== Boolean(endTime)) {
      setError("Isi jam mulai dan jam selesai, atau kosongkan keduanya.");
      return;
    }
    if ((startTime && !TIME_24H.test(startTime)) || (endTime && !TIME_24H.test(endTime))) {
      setError("Gunakan format 24 jam HH:MM, misalnya 09:00.");
      return;
    }
    if (startTime && endTime && startTime >= endTime) {
      setError("Jam selesai harus setelah jam mulai.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/entries/default-hours`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          default_start_time: startTime || null,
          default_end_time: endTime || null,
          default_documentation_url: documentationUrl.trim() || null,
        }),
      });
      if (!response.ok) throw new Error(await apiError(response, "Pengaturan bawaan belum tersimpan."));
      const result = await response.json() as DefaultSettings;
      const cacheCleared = removeBrowserDraft(DEFAULT_HOURS_CACHE_KEY);
      setCacheWarning(cacheCleared ? "" : "Pengaturan tersimpan; cache lama tidak dapat dibersihkan.");
      setSettings(result);
      setStartTime(result.default_start_time ?? "");
      setEndTime(result.default_end_time ?? "");
      setDocumentationUrl(result.default_documentation_url ?? "");
      setConfirming(null);
      setMessage("Pengaturan bawaan tersimpan.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Pengaturan bawaan belum tersimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function apply(kind: "hours" | "documentation") {
    setApplying(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/entries/default-hours/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...range,
          confirmed: true,
          apply_hours: kind === "hours",
          apply_documentation: kind === "documentation",
        }),
      });
      if (!response.ok) throw new Error(await apiError(response, "Pengaturan bawaan belum diterapkan."));
      const result = await response.json() as { updated: number; documentation_updated: number };
      setConfirming(null);
      setMessage(kind === "hours"
        ? `Jam diterapkan ke ${result.updated} entri.`
        : `Dokumentasi diterapkan ke ${result.documentation_updated} entri.`);
      await onApplied();
    } catch (applyError) {
      setError(applyError instanceof Error ? applyError.message : "Pengaturan bawaan belum diterapkan.");
    } finally {
      setApplying(false);
    }
  }

  return (
    <details className="collapse collapse-arrow rounded-box border border-base-300 bg-base-100">
      <summary className="collapse-title min-h-0 px-4 py-4 font-semibold sm:px-5">Jam kerja dan dokumentasi bawaan</summary>
      <div className="collapse-content px-4 pb-5 sm:px-5">
        <p className="mb-5 max-w-2xl text-sm leading-6 text-base-content/70">
          Atur jam kerja dan tautan dokumentasi yang bisa dipakai bersama. Setiap entri tetap dapat diubah secara manual.
        </p>
        <form onSubmit={save}>
          <div className="grid max-w-4xl gap-x-5 gap-y-4 sm:grid-cols-2">
            <label className="form-control w-full">
              <span className="label py-1"><span className="label-text text-xs">Mulai</span></span>
              <input className="input input-bordered input-sm w-full bg-base-100" type="text" inputMode="text" placeholder="09:00" maxLength={5} value={startTime} disabled={loading} onChange={(event) => updateSettingsDraft({ startTime: event.target.value, endTime, documentationUrl })} />
            </label>
            <label className="form-control w-full">
              <span className="label py-1"><span className="label-text text-xs">Selesai</span></span>
              <input className="input input-bordered input-sm w-full bg-base-100" type="text" inputMode="text" placeholder="17:00" maxLength={5} value={endTime} disabled={loading} onChange={(event) => updateSettingsDraft({ startTime, endTime: event.target.value, documentationUrl })} />
            </label>
            <label className="form-control w-full sm:col-span-2">
              <span className="label py-1"><span className="label-text text-xs">Dokumentasi bawaan</span></span>
              <input className="input input-bordered input-sm w-full bg-base-100" type="url" autoComplete="off" spellCheck={false} placeholder="Tempel tautan file atau folder Google Drive" value={documentationUrl} disabled={loading} maxLength={2048} onChange={(event) => updateSettingsDraft({ startTime, endTime, documentationUrl: event.target.value })} />
              <span className="label py-1"><span className="label-text-alt">Tautan ini mengisi entri baru dan entri kosong yang kamu pilih. Tautan manual tetap dipertahankan.</span></span>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="text-xs leading-5 text-base-content/65">Format jam 24 jam: HH:MM.</p>
            <button type="submit" className={`btn ${settingsDirty ? "btn-primary" : "btn-outline"} btn-sm`} disabled={loading || saving || !settingsDirty}>
              {saving ? "Menyimpan…" : "Simpan pengaturan"}
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {hoursDirty && eligibleCount > 0 && <p className="text-xs text-base-content/65">Simpan perubahan jam sebelum menerapkannya.</p>}
          {!hoursDirty && settings.default_start_time && settings.default_end_time && eligibleCount > 0 && !confirming && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setConfirming("hours"); setError(""); setMessage(""); }}>
              Tinjau jam untuk {eligibleCount} entri
            </button>
          )}
          {documentationDirty && documentationEligibleCount > 0 && <p className="text-xs text-base-content/65">Simpan perubahan tautan sebelum menerapkannya.</p>}
          {!documentationDirty && settings.default_documentation_url && documentationEligibleCount > 0 && !confirming && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setConfirming("documentation"); setError(""); setMessage(""); }}>
              Tinjau tautan untuk {documentationEligibleCount} entri
            </button>
          )}
        </div>

        {confirming && (
          <div className="alert alert-warning mt-4 items-start">
            <div className="space-y-2">
              {confirming === "hours" ? (
                <>
                  <p className="font-semibold">Terapkan {settings.default_start_time}–{settings.default_end_time} ke {eligibleCount} entri dalam rentang ini?</p>
                  <p className="text-sm leading-6">Entri tetap berstatus draf dan belum disetujui.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Isi dokumentasi yang kosong pada {documentationEligibleCount} entri dalam rentang ini?</p>
                  <p className="break-all text-sm leading-6">{settings.default_documentation_url}</p>
                  <p className="text-sm leading-6">Tautan yang sudah diisi manual tidak akan diganti.</p>
                </>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" className="btn btn-primary btn-sm" disabled={applying} onClick={() => apply(confirming)}>
                  {applying ? "Menerapkan…" : confirming === "hours" ? "Ya, terapkan jam" : "Ya, terapkan dokumentasi"}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" disabled={applying} onClick={() => setConfirming(null)}>Batal</button>
              </div>
            </div>
          </div>
        )}

        {error && <p role="alert" className="mt-3 text-sm text-error-content">{error}</p>}
        {cacheWarning && <p role="alert" className="mt-3 text-sm text-warning-content">{cacheWarning}</p>}
        {message && <p role="status" className="mt-3 text-sm text-success-content">{message}</p>}
      </div>
    </details>
  );
}
