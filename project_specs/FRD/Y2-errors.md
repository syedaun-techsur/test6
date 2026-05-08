
---

## Y2: Cross-Feature Error Catalog

This section catalogues every error condition in TodoApp v1, the features that can raise them, the handling behaviour, and the user-visible message (if any). Since TodoApp has no network layer, there are no HTTP status codes — errors are caught exceptions handled in-browser.

---

### Error Code Reference

| Error Code | Type | Raised By | Trigger Condition |
|------------|------|-----------|-------------------|
| `TASK_TITLE_EMPTY` | `ValidationError` | F1 (Add Task) | `title.trim() === ""` on submission |
| `TASK_NOT_FOUND` | Internal (silent) | F2 (Toggle), F3 (Delete) | `taskId` not found in `tasks[]` |
| `TASK_ID_COLLISION` | Internal (silent) | F1 (Add Task) | Generated `id` already exists in `tasks[]` |
| `TASK_SCHEMA_INVALID` | Internal (silent) | F0 (Render), F4 (Load) | Malformed item in deserialised array |
| `STORAGE_READ_FAILED` | `StorageError` | F4 (`loadTasks`) | `localStorage.getItem` throws |
| `STORAGE_CORRUPT` | `StorageError` | F4 (`loadTasks`) | Stored value fails `JSON.parse` or is not an array |
| `STORAGE_QUOTA_EXCEEDED` | `StorageError` | F4 (`saveTasks`), surfaces in F1/F2/F3 | `localStorage.setItem` throws `QuotaExceededError` |
| `STORAGE_WRITE_FAILED` | `StorageError` | F4 (`saveTasks`), surfaces in F1/F2/F3 | `localStorage.setItem` throws any non-quota error |
| `DOM_CONTAINER_MISSING` | Internal (dev error) | F0 (`renderTaskList`) | List container element not found in DOM |

---

### Detailed Error Handling

#### `TASK_TITLE_EMPTY`

- **Feature:** F1 (Add Task)
- **Trigger:** User submits the Add Form with an empty or whitespace-only input.
- **Behaviour:** Task not created. Validation error message displayed below the input field. Input remains focused. No mutation to `tasks[]` or local storage.
- **User Message:** `"Task title cannot be empty."`
- **Recovery:** User types a non-empty title and resubmits. Error message is cleared on the next successful submission.

---

#### `TASK_NOT_FOUND`

- **Features:** F2 (Toggle), F3 (Delete)
- **Trigger:** The `taskId` in a `data-task-id` attribute does not match any task in the current `tasks[]` (stale DOM after a race condition or direct DOM manipulation).
- **Behaviour:** Operation aborted. `renderTaskList(tasks)` called immediately to resync the DOM to the current state. No user-visible message.
- **User Message:** None.
- **Recovery:** Automatic (DOM resynced). No user action required.

---

#### `TASK_ID_COLLISION`

- **Feature:** F1 (Add Task)
- **Trigger:** Generated `id` already exists in `tasks[]`.
- **Behaviour:** App regenerates a new `id` and retries (up to 5 attempts). If all 5 collide (astronomically unlikely with UUID v4), logs `console.error` and aborts task creation with `STORAGE_WRITE_FAILED`.
- **User Message:** None (silent retry).
- **Recovery:** Automatic.

---

#### `TASK_SCHEMA_INVALID`

- **Features:** F0 (Render), F4 (Load)
- **Trigger:** An item in the deserialised `Task[]` fails `isValidTask()` (missing `id`, `title`, or non-boolean `completed`).
- **Behaviour:** Item is silently skipped. Remaining valid items are rendered normally. No user-visible message.
- **User Message:** None.
- **Recovery:** Invalid item is excluded from all future saves; it is effectively lost.

---

#### `STORAGE_READ_FAILED`

- **Feature:** F4 (`loadTasks`)
- **Trigger:** `localStorage.getItem` throws (e.g., `SecurityError` in some private-browsing modes, or browser with storage disabled).
- **Behaviour:** `loadTasks` returns `[]`. App renders the empty state. `console.warn` logged.
- **User Message:** None (empty state shown with the standard empty-state prompt).
- **Recovery:** None in v1. If local storage is unavailable, the app works as a session-only in-memory list for the current page lifetime.

---

#### `STORAGE_CORRUPT`

- **Feature:** F4 (`loadTasks`)
- **Trigger:** Stored value under `"todoapp_tasks"` fails `JSON.parse`, or parsed value is not a JavaScript array.
- **Behaviour:** Key is removed (`localStorage.removeItem("todoapp_tasks")`). `loadTasks` returns `[]`. App renders the empty state. `console.warn` logged.
- **User Message:** None (empty state shown).
- **Recovery:** App starts fresh. Existing task data is unrecoverable.

---

#### `STORAGE_QUOTA_EXCEEDED`

- **Feature:** F4 (`saveTasks`); surfaced in F1, F2, F3.
- **Trigger:** `localStorage.setItem` throws `QuotaExceededError` (browser storage limit reached).
- **Behaviour:** `saveTasks` throws `StorageError`. The calling action (add/toggle/delete) reverts its in-memory mutation. A global error banner or inline message is shown.
- **User Message:** `"Storage full. Delete some tasks to free space."`
- **Recovery:** User must delete existing tasks (F3) to free local storage space, then retry the failed action.

---

#### `STORAGE_WRITE_FAILED`

- **Feature:** F4 (`saveTasks`); surfaced in F1, F2, F3.
- **Trigger:** `localStorage.setItem` throws any error other than `QuotaExceededError`.
- **Behaviour:** `saveTasks` throws `StorageError`. Calling action reverts in-memory mutation. Error message shown.
- **User Message:** Depends on calling feature:
  - F1: `"Could not save task. Please try again."`
  - F2: `"Could not save change. Please try again."`
  - F3: `"Could not delete task. Please try again."`
- **Recovery:** User retries the action. If the error persists, a browser or OS-level issue may be present.

---

#### `DOM_CONTAINER_MISSING`

- **Feature:** F0 (`renderTaskList`)
- **Trigger:** The expected list container DOM element (e.g., `<ul id="task-list">`) is not present in the document.
- **Behaviour:** `renderTaskList` logs `console.error("DOM container #task-list not found")` and returns without rendering. No user-visible message.
- **User Message:** None.
- **Recovery:** Developer fix required — the HTML template is missing the required element. Not a runtime user-recoverable error.

---

### Error Display Patterns

| Pattern | Usage |
|---------|-------|
| **Inline validation message** | Shown directly below the Add Form input for `TASK_TITLE_EMPTY`. Removed on next successful submission. |
| **Global error banner** | A dismissible banner at the top of the task list for storage errors (`STORAGE_QUOTA_EXCEEDED`, `STORAGE_WRITE_FAILED`). Auto-dismisses after 5 seconds or on next successful operation. |
| **Silent / console only** | `TASK_NOT_FOUND`, `TASK_SCHEMA_INVALID`, `TASK_ID_COLLISION`, `DOM_CONTAINER_MISSING`, `STORAGE_READ_FAILED`, `STORAGE_CORRUPT` — these do not show messages to the user. |

---
