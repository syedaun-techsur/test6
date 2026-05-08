
---

## Y1: Client-Side Module Interface

TodoApp v1 has no network API. The "API" is the client-side JavaScript module interface — a set of pure functions that mutate state and side-effect into DOM and local storage. This section documents all public functions, their signatures, contracts, and which PRD features they serve.

> **Note:** There are no HTTP endpoints. All interactions are synchronous, in-browser, in-process function calls.

---

### §TaskStore — Core State Functions

#### `loadTasks() → Task[]`

| Attribute | Value |
|-----------|-------|
| **Used by** | F0 (page load render), F4 (owns implementation) |
| **Side effects** | Reads `localStorage["todoapp_tasks"]`; may call `localStorage.removeItem` on corrupt data |
| **Returns** | A valid `Task[]`; always an array, never `null` |
| **Throws** | Never — all errors caught internally; fallback is `[]` |

**Contract:**
- Must be called once on `DOMContentLoaded` before any render or user interaction.
- If local storage is inaccessible, returns `[]` silently.
- If stored JSON is corrupt or not an array, removes the key and returns `[]`.
- Filters out any items that fail `isValidTask(item)` before returning.

---

#### `saveTasks(tasks: Task[]) → void`

| Attribute | Value |
|-----------|-------|
| **Used by** | F1 (add), F2 (toggle), F3 (delete), F4 (owns implementation) |
| **Side effects** | Writes serialised `Task[]` to `localStorage["todoapp_tasks"]` |
| **Returns** | `void` on success |
| **Throws** | `StorageError` with `.code = "STORAGE_QUOTA_EXCEEDED"` or `"STORAGE_WRITE_FAILED"` |

**Contract:**
- Caller must revert any in-memory mutation and surface an error message to the user if this function throws.
- Must be called **before** `renderTaskList` so that persistence is confirmed before the DOM update.
- Must serialise the full current `tasks[]` — never a diff or partial update.

---

#### `isValidTask(item: unknown) → boolean`

| Attribute | Value |
|-----------|-------|
| **Used by** | F4 (`loadTasks` deserialization guard) |
| **Side effects** | None |
| **Returns** | `true` if item conforms to the `Task` schema; `false` otherwise |
| **Throws** | Never |

**Contract:**
- Returns `true` if and only if:
  - `item` is a non-null object
  - `item.id` is a non-empty string
  - `item.title` is a non-empty string
  - `item.completed` is a boolean
- `item.createdAt` may be absent or zero — this does not fail validation.

---

### §TaskActions — Mutation Functions

#### `addTask(title: string) → Task`

| Attribute | Value |
|-----------|-------|
| **Used by** | F1 (Add Task) |
| **Side effects** | Mutates `tasks[]`, calls `saveTasks`, calls `renderTaskList`, clears input DOM element |
| **Returns** | The newly created `Task` object |
| **Throws** | `ValidationError` with `.code = "TASK_TITLE_EMPTY"` if `title.trim() === ""`; `StorageError` (propagated from `saveTasks`) on storage failure |

**Contract:**
- Trims `title` before processing.
- Generates a unique `id` (retry on collision).
- Sets `completed: false` and `createdAt: Date.now()`.
- On `StorageError`, reverts the push to `tasks[]` before rethrowing.
- On success, clears the input DOM element and returns focus to it.

---

#### `toggleTask(taskId: string) → void`

| Attribute | Value |
|-----------|-------|
| **Used by** | F2 (Mark Task Complete) |
| **Side effects** | Mutates `task.completed` in `tasks[]`, calls `saveTasks`, calls `renderTaskList` |
| **Returns** | `void` |
| **Throws** | `StorageError` (propagated from `saveTasks`) on storage failure |

**Contract:**
- If `taskId` is not found in `tasks[]`, calls `renderTaskList` to resync DOM and returns without throwing.
- On `StorageError`, reverts `task.completed` to its prior value before rethrowing.
- Only mutates `completed` — all other fields remain unchanged.

---

#### `deleteTask(taskId: string) → void`

| Attribute | Value |
|-----------|-------|
| **Used by** | F3 (Delete Task) |
| **Side effects** | Removes item from `tasks[]`, calls `saveTasks`, calls `renderTaskList` |
| **Returns** | `void` |
| **Throws** | `StorageError` (propagated from `saveTasks`) on storage failure |

**Contract:**
- If `taskId` is not found in `tasks[]`, calls `renderTaskList` to resync DOM and returns without throwing.
- On `StorageError`, re-inserts the removed task at its original index before rethrowing.
- No confirmation dialog is shown before calling this function (PRD requirement).

---

### §Renderer — DOM Functions

#### `renderTaskList(tasks: Task[]) → void`

| Attribute | Value |
|-----------|-------|
| **Used by** | F0, F1, F2, F3 (all features that change state) |
| **Side effects** | Fully replaces the inner HTML of the list container DOM element |
| **Returns** | `void` |
| **Throws** | Never — logs `console.error` if DOM container is not found |

**Contract:**
- Idempotent: calling twice with the same `tasks[]` produces the same DOM.
- If `tasks.length === 0`: hides list container, shows empty-state element.
- If `tasks.length > 0`: shows list container, hides empty-state element, renders one `<li>` per task in array order.
- Each `<li>` contains:
  - `<input type="checkbox" data-task-id="{id}" [checked]>` — reflects `task.completed`
  - `<span class="task-title [completed]">{title}</span>` — strikethrough when completed
  - `<button data-task-id="{id}" aria-label="Delete task">Delete</button>`
- After rendering, rebinds event listeners for checkbox `change` → `toggleTask` and button `click` → `deleteTask`.

---

### §Error Types

```typescript
class ValidationError extends Error {
  code: "TASK_TITLE_EMPTY";
}

class StorageError extends Error {
  code: "STORAGE_READ_FAILED" | "STORAGE_WRITE_FAILED" | "STORAGE_QUOTA_EXCEEDED" | "STORAGE_CORRUPT";
}
```

These are never surfaced to the user as technical codes — the calling function translates them to user-friendly messages (see `Y2-errors.md`).

---
