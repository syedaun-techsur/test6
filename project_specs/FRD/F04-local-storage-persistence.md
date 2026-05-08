
---

## F04: Local Storage Persistence

**PRD Reference:** F4 | **Priority:** P0 (Critical — MVP)

**Description:** All task data is automatically and synchronously persisted to `window.localStorage` under the key `"todoapp_tasks"` on every state-changing operation (add, complete/uncomplete, delete). On every page load the app reads this key, parses the stored JSON, and reconstructs the in-memory task array before any user interaction is possible. The user never sees a "Save" button — persistence is invisible and automatic. The feature also handles edge cases such as a missing key (first run), corrupt JSON, and browser storage errors gracefully, always preferring a clean empty state over an error state that blocks the UI.

---

### Terminology

- **Storage Key:** The string `"todoapp_tasks"` — the sole local storage key used by TodoApp v1.
- **Serialisation:** Converting the `Task[]` array to a JSON string via `JSON.stringify`.
- **Deserialisation:** Parsing a JSON string back to a `Task[]` via `JSON.parse`.
- **Auto-Save:** Calling `saveTasks(tasks)` immediately after any mutation of the task array, with no user action required.
- **Auto-Load:** Calling `loadTasks()` on `DOMContentLoaded`, before rendering.
- **Graceful Fallback:** Returning `[]` (empty array) whenever loading fails, rather than throwing to the caller.
- **QuotaExceededError:** The `DOMException` thrown by `localStorage.setItem` when the storage quota for the origin has been reached.

---

### Sub-Features

- Auto-load task array from local storage on page load
- Auto-save task array to local storage on every mutation
- JSON serialisation / deserialisation of the Task array
- Graceful handling of missing storage key (first run returns `[]`)
- Graceful handling of corrupt JSON (returns `[]`, logs warning)
- Graceful handling of `QuotaExceededError` on write
- Graceful handling of other write errors
- Graceful handling of storage-read errors (e.g., private-browsing restriction)

---

### Process — `loadTasks()` (called on page load)

1. App calls `localStorage.getItem("todoapp_tasks")` inside a `try/catch`.
2. **If `getItem` throws** (e.g., `SecurityError` in some private-browsing contexts):
   a. Log `console.warn("localStorage read failed:", error)`.
   b. Return `[]`.
3. **If result is `null`** (key does not exist — first run or storage was cleared):
   a. Return `[]`.
4. **If result is a non-null string:**
   a. Parse: `JSON.parse(rawString)` inside a `try/catch`.
   b. If `JSON.parse` throws (corrupt JSON):
      - Log `console.warn("Corrupt task data in localStorage; resetting to []")`.
      - Remove the corrupt key: `localStorage.removeItem("todoapp_tasks")`.
      - Return `[]`.
   c. If parsed value is not an array: treat as corrupt (same as 4b).
   d. Filter parsed array: keep only items that pass `isValidTask(item)` (see Validation).
   e. Return the filtered array.

### Process — `saveTasks(tasks)` (called after every mutation)

1. App calls `JSON.stringify(tasks)` → `serialised`.
2. App calls `localStorage.setItem("todoapp_tasks", serialised)` inside a `try/catch`.
3. **If `setItem` throws `QuotaExceededError`:**
   a. Caller (F01, F02, or F03) is notified via a thrown `Error` with code `STORAGE_QUOTA_EXCEEDED`.
   b. Caller reverts its in-memory mutation and surfaces the error message to the user.
4. **If `setItem` throws any other error:**
   a. Caller is notified via a thrown `Error` with code `STORAGE_WRITE_FAILED`.
   b. Caller reverts its in-memory mutation and surfaces the error message to the user.
5. If `setItem` succeeds, return normally; caller proceeds to `renderTaskList`.

---

### Inputs

**`loadTasks()`**
- No parameters. Reads from `localStorage["todoapp_tasks"]`.

**`saveTasks(tasks)`**
- `tasks` (Task[], required): The current in-memory task array to be serialised and stored.

### Outputs

**`loadTasks()`**
- Returns `Task[]` — always an array, never `null`/`undefined`. May be empty `[]`.

**`saveTasks(tasks)`**
- Returns `void` on success.
- Throws `Error` (with `.code` property set to `STORAGE_QUOTA_EXCEEDED` or `STORAGE_WRITE_FAILED`) on failure.

---

### Validation

**`isValidTask(item)` predicate — used during `loadTasks` deserialisation:**
- `item` must be a non-null object.
- `item.id` must be a non-empty string.
- `item.title` must be a non-empty string.
- `item.completed` must be a boolean.
- `item.createdAt` must be a number (milliseconds epoch); missing `createdAt` is tolerated — assign `0` as fallback (backwards-compatibility).

**`saveTasks` pre-conditions:**
- `tasks` must be a valid JavaScript array before `JSON.stringify` is called.
- Each task in the array must satisfy `isValidTask`; if a non-conforming item is present, log a warning and skip it rather than rejecting the whole save.

---

### Error States

| Scenario | Behaviour | Error Code | User-Visible Message |
|----------|-----------|------------|----------------------|
| `localStorage.getItem` throws on load | Return `[]`; log warning | `STORAGE_READ_FAILED` | None (empty state shown) |
| Missing key on load (first run) | Return `[]` | — | None (empty state shown) |
| Corrupt JSON on load | Reset key, return `[]`; log warning | `STORAGE_CORRUPT` | None (empty state shown) |
| Parsed value is not an array | Reset key, return `[]`; log warning | `STORAGE_CORRUPT` | None (empty state shown) |
| `QuotaExceededError` on save | Throw `STORAGE_QUOTA_EXCEEDED`; caller reverts + alerts | `STORAGE_QUOTA_EXCEEDED` | `"Storage full. Delete some tasks to free space."` |
| Other error on save | Throw `STORAGE_WRITE_FAILED`; caller reverts + alerts | `STORAGE_WRITE_FAILED` | `"Could not save. Please try again."` |

---

### API Surface (this feature)

See `Y1-api.md §TaskStore` for full signatures.

| Function | Signature | Role in F04 |
|----------|-----------|-------------|
| `loadTasks` | `() → Task[]` | Deserialises and returns task array from local storage |
| `saveTasks` | `(tasks: Task[]) → void` | Serialises and writes task array to local storage |
| `isValidTask` | `(item: unknown) → boolean` | Schema guard used during deserialisation |

---

### Schema Surface (this feature)

Owns the `"todoapp_tasks"` storage key and the JSON wire format of `Task[]` — see `Y0-schema.md §Storage Layout`.

---
