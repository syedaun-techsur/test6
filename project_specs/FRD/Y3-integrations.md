
---

## Y3: Browser API Integration Points

TodoApp v1 has no external third-party service integrations. The only integration surface is the set of browser-native APIs that the app relies on. This section documents each browser API dependency, its usage context, and the fallback behaviour when the API is unavailable.

---

### §Window.localStorage

| Attribute | Detail |
|-----------|--------|
| **API** | `window.localStorage` (`Storage` interface) |
| **Spec** | [Web Storage API — WHATWG Living Standard](https://html.spec.whatwg.org/multipage/webstorage.html) |
| **Methods used** | `getItem(key)`, `setItem(key, value)`, `removeItem(key)` |
| **Storage key** | `"todoapp_tasks"` |
| **Value format** | JSON string — `Task[]` serialised via `JSON.stringify` |
| **Quota** | Browser-dependent; typically 5–10 MB per origin |
| **Availability** | Present in all target browsers (Chrome, Firefox, Safari, Edge — current and previous stable) |
| **Unavailability scenario** | Private/Incognito browsing in some browsers may restrict or disable `localStorage`. Access throws a `SecurityError`. |
| **Fallback** | App runs in session-only mode: tasks survive in-memory for the page session but are not persisted across refreshes. No user-visible error; empty state is shown on reload. |
| **Used by** | F4 (`loadTasks`, `saveTasks`); indirectly by F0, F1, F2, F3 |

---

### §Document / DOM Events

| Attribute | Detail |
|-----------|--------|
| **API** | `document` event model |
| **Events used** | `DOMContentLoaded` (page init), `click` (delete button), `change` (checkbox), `keydown` (Enter key on input) |
| **Availability** | Universal — present in all target browsers |
| **Unavailability scenario** | JavaScript disabled entirely — app does not function. No graceful fallback possible (JS-only app by design). |
| **Used by** | F0 (page init), F1 (Enter key + button click), F2 (checkbox change), F3 (delete button click) |

---

### §Crypto / ID Generation

| Attribute | Detail |
|-----------|--------|
| **API** | `crypto.randomUUID()` (preferred) or `Date.now().toString(36)` (fallback) |
| **Spec** | [Web Crypto API — W3C](https://www.w3.org/TR/WebCryptoAPI/) |
| **Usage** | Generating unique `task.id` values at creation time (F1) |
| **Availability** | `crypto.randomUUID()` available in Chrome 92+, Firefox 95+, Safari 15.4+, Edge 92+ — all within target browser scope |
| **Fallback** | If `crypto.randomUUID` is unavailable, fall back to `Date.now().toString(36) + Math.random().toString(36).slice(2)` |
| **Used by** | F1 (`addTask`) |

---

### §JSON (Built-in)

| Attribute | Detail |
|-----------|--------|
| **API** | `JSON.stringify`, `JSON.parse` |
| **Usage** | Serialise `Task[]` to string for storage; deserialise string back to `Task[]` on load |
| **Availability** | Universal — part of the ECMAScript standard; present in all JS environments |
| **Error handling** | `JSON.parse` errors caught in `loadTasks` and treated as `STORAGE_CORRUPT` (see `Y2-errors.md`) |
| **Used by** | F4 (`loadTasks`, `saveTasks`) |

---

### §Compatibility Matrix

| Browser | Min Supported Version | localStorage | DOMContentLoaded | crypto.randomUUID |
|---------|-----------------------|-------------|------------------|-------------------|
| Chrome | Current − 1 (≥ 137) | ✅ | ✅ | ✅ (≥ 92) |
| Firefox | Current − 1 (≥ 137) | ✅ | ✅ | ✅ (≥ 95) |
| Safari | Current − 1 (≥ 17) | ✅ | ✅ | ✅ (≥ 15.4) |
| Edge | Current − 1 (≥ 135) | ✅ | ✅ | ✅ (≥ 92) |

All required browser APIs are available in all target browsers. No polyfills are required for v1.

---

### §Out-of-Scope Integrations (v1)

The following integrations are explicitly **not** implemented in v1:

| Integration | Reason Excluded |
|-------------|----------------|
| Cloud sync (e.g., Firebase, Supabase) | No backend in v1; single-user local scope |
| Authentication providers (OAuth, MSAL) | No auth in v1 |
| Push notifications / reminders | No due-date feature in v1 |
| Service Worker / PWA offline cache | Local storage is the only offline mechanism needed in v1 |
| Analytics (e.g., Plausible, GA) | Out of scope for v1 |
| Error monitoring (e.g., Sentry) | Out of scope for v1; `console.error/warn` used instead |

---
