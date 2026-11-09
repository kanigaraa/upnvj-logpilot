import assert from "node:assert/strict";
import test from "node:test";

import { readBrowserDraft, removeBrowserDraft, writeBrowserDraft } from "./browser-draft-cache.mjs";

function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function withStorage(t, storage) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage },
  });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else delete globalThis.window;
  });
}

test("write/read/remove keeps a draft through JSON storage", (t) => {
  withStorage(t, memoryStorage());
  const value = { activity_text: "Memperbaiki tampilan halaman", result_text: "Tata letak diperbarui." };

  assert.equal(writeBrowserDraft("logpilot.entry.test.v1", value), true);
  assert.deepEqual(readBrowserDraft("logpilot.entry.test.v1"), value);
  assert.equal(removeBrowserDraft("logpilot.entry.test.v1"), true);
  assert.equal(readBrowserDraft("logpilot.entry.test.v1"), null);
});

test("read removes malformed JSON instead of restoring it", (t) => {
  const storage = memoryStorage({ "logpilot.entry.test.v1": "{bad json" });
  withStorage(t, storage);

  assert.equal(readBrowserDraft("logpilot.entry.test.v1"), null);
  assert.equal(storage.getItem("logpilot.entry.test.v1"), null);
});

test("read rejects a daily draft when its server baseline changed", (t) => {
  const storage = memoryStorage({
    "logpilot.entry.test.v1": JSON.stringify({ base: { activity_text: "Versi lama" }, draft: { activity_text: "Edit lokal" } }),
  });
  withStorage(t, storage);

  assert.equal(readBrowserDraft("logpilot.entry.test.v1", (value) => value.base.activity_text === "Versi terbaru"), null);
  assert.equal(storage.getItem("logpilot.entry.test.v1"), null);
});

test("read rejects a reflection draft when its source hash changed", (t) => {
  const storage = memoryStorage({
    "logpilot.reflection.test.v1": JSON.stringify({ source_hash: "old-hash", text: "Draf lokal" }),
  });
  withStorage(t, storage);

  assert.equal(readBrowserDraft("logpilot.reflection.test.v1", (value) => value.source_hash === "new-hash"), null);
  assert.equal(storage.getItem("logpilot.reflection.test.v1"), null);
});

test("read rejects default settings based on older server values", (t) => {
  const storage = memoryStorage({
    "logpilot.default-hours.v1": JSON.stringify({ base: { default_start_time: "09:00" }, values: { default_start_time: "10:00" } }),
  });
  withStorage(t, storage);

  assert.equal(readBrowserDraft("logpilot.default-hours.v1", (value) => value.base.default_start_time === "08:00"), null);
  assert.equal(storage.getItem("logpilot.default-hours.v1"), null);
});

test("write reports storage quota errors without throwing", (t) => {
  withStorage(t, {
    getItem: () => null,
    setItem: () => { throw new Error("quota exceeded"); },
    removeItem: () => {},
  });

  assert.equal(writeBrowserDraft("logpilot.entry.test.v1", { activity_text: "Draf" }), false);
});
