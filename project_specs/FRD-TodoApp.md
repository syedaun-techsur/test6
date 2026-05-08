# Functional Requirements Document — TodoApp

**Project:** Basic To-Do App
**Acronym:** TodoApp
**FRD Version:** 1.0
**PRD Version:** 1.0
**Generated:** 2026-05-08
**Status:** Draft

---

## Scope

This document provides the detailed functional specification for TodoApp v1 — a frontend-only, single-screen personal task management application. It covers all five PRD features (F0–F4), the local storage data schema, the client-side module interface, the full error catalog, and browser API integration points. There is no backend, no REST API over a network, and no authentication system in scope for v1.

---

## How to Read This Document

- **Feature chunks** (`F00`–`F04`) each contain the full behavioural spec for one PRD feature: description, sub-features, step-by-step process, inputs, outputs, validation rules, error states, and references to the cross-feature schema/API chunks.
- **Cross-feature chunks** (`Y0`–`Y3`) contain the consolidated data model, client-side module interface, error catalog, and browser integration contracts.
- **Feature IDs** (`F0`–`F4`) match those in `PRD-TodoApp.md` exactly.
- **Error codes** are strings in `SCREAMING_SNAKE_CASE` and appear in both the per-feature error tables and the master catalog in `Y2-errors.md`.
- All **process steps** are numbered sequentially within a feature.
- Cross-references use the form `see F03 §Process` or `see Y0-schema.md §Task`.

---

## Master Table of Contents

| Section | File | Description |
|---------|------|-------------|
| Header | `00-header.md` | This file — scope, conventions, TOC, shared terminology |
| F0 | `F00-view-task-list.md` | View Task List |
| F1 | `F01-add-task.md` | Add Task |
| F2 | `F02-mark-task-complete.md` | Mark Task Complete |
| F3 | `F03-delete-task.md` | Delete Task |
| F4 | `F04-local-storage-persistence.md` | Local Storage Persistence |
| Y0 | `Y0-schema.md` | Local Storage Data Schema |
| Y1 | `Y1-api.md` | Client-Side Module Interface |
| Y2 | `Y2-errors.md` | Cross-Feature Error Catalog |
| Y3 | `Y3-integrations.md` | Browser API Integration Points |

---

## Cross-Cutting Terminology

- **Task:** A single to-do item with a title string and a boolean completion state. The atomic unit of data in TodoApp.
- **Task List:** The ordered collection of all tasks currently held in memory and mirrored in local storage.
- **Local Storage:** The browser's `window.localStorage` key-value store used as the sole persistence layer. Scoped to the browser origin; survives page refresh and browser restart.
- **Storage Key:** The fixed string `"todoapp_tasks"` under which the serialised task array is stored in local storage.
- **Task ID:** A unique identifier assigned to each task at creation time, used to locate and mutate individual tasks. Generated client-side as a UUID v4 or monotonic timestamp string.
- **Completion State:** A boolean flag (`completed: true | false`) attached to each task indicating whether it has been marked done.
- **Empty State:** The UI condition when the task list contains zero items.
- **CRUD:** Create, Read, Update, Delete — the four basic operations on tasks (Add = Create, View = Read, Complete/Uncomplete = Update, Delete = Delete).
- **Immediate UI Update:** A UI change that is visible to the user within one synchronous JavaScript event-loop tick — i.e., before any `setTimeout` or network round-trip.
- **Auto-Save:** Writing the current task array to local storage automatically, with no user-initiated save action, every time the array changes.
- **Auto-Load:** Reading the task array from local storage on `DOMContentLoaded` and rendering the full list before any user interaction.

---

---

## F00: View Task List

**PRD Reference:** F0 | **Priority:** P0 (Critical — MVP)

**Description:** The primary screen displays all tasks currently held in the in-memory task array, which is loaded from local storage on page start. The list is always visible; no navigation is required to reach it. When the task array is empty, a contextual prompt encourages the user to create their first task. The list re-renders automatically whenever the task array changes (add, complete/uncomplete, or delete) — the user never needs to refresh the page.

---

### Terminology

- **Task Row:** A single rendered list item representing one task. Contains the completion toggle, the task title, and the delete control.
- **Empty State:** The view rendered when the task array has zero items.
- **Real-Time Render:** A DOM update triggered synchronously after any state mutation, within the same event-loop tick as the mutation.

---

### Sub-Features

- Display the full task list on initial page load
- Render each task's title and completion state
- Show an empty-state message when the list contains no tasks
- Re-render the list immediately after any add, complete/uncomplete, or delete action

---

### Process

1. Browser loads the HTML page; `DOMContentLoaded` fires.
2. App calls `loadTasks()` (see F4 §Process), which reads `localStorage.getItem("todoapp_tasks")` and returns a parsed task array (or `[]` on miss/error).
3. App stores the task array in an in-memory `tasks` variable.
4. App calls `renderTaskList(tasks)`:
   a. If `tasks.length === 0`, render the empty-state message ("No tasks yet — add one above!") and hide the task list container.
   b. If `tasks.length > 0`, hide the empty-state message, show the task list container, and for each task render a Task Row (see Sub-Features).
5. Each Task Row renders:
   - A checkbox (checked if `task.completed === true`)
   - The task title text (with `text-decoration: line-through` if `task.completed === true`)
   - A delete button labelled "Delete" (or a trash icon with `aria-label="Delete task"`)
6. The app binds event listeners to the checkbox and delete button of each row (see F2 and F3 respectively).
7. After any state mutation (F1, F2, F3), the app re-invokes `renderTaskList(tasks)` to keep the DOM in sync.

---

### Inputs

- `tasks` (Task[], internal): The in-memory task array populated by `loadTasks()` on page load and mutated by F1, F2, F3 operations.

### Outputs

- **Non-empty list:** A scrollable `<ul>` or `<ol>` element containing one `<li>` Task Row per task, rendered in the order tasks appear in the array.
- **Empty state:** A visible `<p>` or `<div>` element with the message: `"No tasks yet — add one above!"` (exact copy can be adjusted by UI; semantic meaning must be preserved).
- **Completion styling:** Tasks with `completed: true` render with a `line-through` text decoration and optionally a muted/grey colour.

---

### Validation

- The task array must always be a valid JavaScript array (never `null` or `undefined`); if `loadTasks()` returns a non-array, the app resets to `[]`.
- Each item in the array must conform to the Task schema (see `Y0-schema.md §Task`); malformed items are silently skipped and do not prevent the rest of the list from rendering.
- Render must be idempotent: calling `renderTaskList` twice with the same array produces the same DOM state.

---

### Error States

| Scenario | Behaviour | Error Code | User-Visible Message |
|----------|-----------|------------|----------------------|
| `localStorage` read throws (e.g. private-browsing restriction) | App falls back to `tasks = []`; renders empty state | `STORAGE_READ_FAILED` | None (silent fallback; empty state shown) |
| Task array contains a malformed item (missing `id` or `title`) | Malformed item is skipped; rest of list renders normally | `TASK_SCHEMA_INVALID` | None (silent skip) |
| DOM container element not found | App logs `console.error`; no render attempted | `DOM_CONTAINER_MISSING` | None (developer error) |

---

### API Surface (this feature)

See `Y1-api.md §TaskStore` for the full module interface.

| Function | Signature | Role in F00 |
|----------|-----------|-------------|
| `loadTasks` | `() → Task[]` | Reads and parses tasks from local storage on page load |
| `renderTaskList` | `(tasks: Task[]) → void` | Renders the DOM list from the current task array |

---

### Schema Surface (this feature)

Uses the `Task` object and the `"todoapp_tasks"` storage key — see `Y0-schema.md §Task` for the full field definitions.

---

---

## F01: Add Task

**PRD Reference:** F1 | **Priority:** P0 (Critical — MVP)

**Description:** A persistent text input at the top of the interface allows the user to type a task title and submit it via a button click or the Enter key. On submission the app validates the input, creates a new Task object, appends it to the in-memory task array, saves the updated array to local storage (see F4), and immediately re-renders the task list (see F0). The input field is cleared after a successful submission, ready for the next entry.

---

### Terminology

- **Add Form:** The UI region containing the text input and submit button, always visible at the top of the page.
- **Task Title:** The raw string entered by the user, trimmed of leading/trailing whitespace, that becomes the `title` field of a new Task.
- **Trimmed Input:** `input.value.trim()` — the canonical string after whitespace stripping.
- **Submit Action:** Either a click on the "Add Task" button or a press of the Enter key while the text input has focus.

---

### Sub-Features

- Always-visible text input field for entering a task title
- Submit via "Add Task" button click
- Submit via Enter key press while input is focused
- Input validation (non-empty after trim)
- New task creation and immediate list append
- Input field clear after successful submission
- Auto-save to local storage on task creation (delegates to F4)

---

### Process

1. User types a title into the text input (`<input type="text" id="task-input">`).
2. User triggers the Submit Action (button click or Enter key).
3. App reads `inputElement.value` and trims whitespace → `trimmedTitle`.
4. **Validation check:** If `trimmedTitle === ""`, the app:
   a. Does NOT create a task.
   b. Adds a visible validation error message below the input: `"Task title cannot be empty."` (or equivalent).
   c. Returns without modifying the task array or local storage.
   d. Leaves the (empty) input focused so the user can correct it.
5. If `trimmedTitle` is valid:
   a. App generates a new `id` (UUID v4 or `Date.now().toString(36)` — unique, non-empty string).
   b. App constructs a new Task object: `{ id, title: trimmedTitle, completed: false, createdAt: Date.now() }`.
   c. App appends the Task to the in-memory `tasks` array: `tasks.push(newTask)`.
   d. App calls `saveTasks(tasks)` (see F4 §Process) to persist the updated array.
   e. App calls `renderTaskList(tasks)` (see F0 §Process) to update the DOM.
   f. App clears the input: `inputElement.value = ""`.
   g. App removes any visible validation error message from a prior failed submission.
   h. App returns focus to the input field so the user can immediately add another task.
6. The new task appears at the bottom of the rendered list (appended in array order).

---

### Inputs

- `title` (string, required): Raw text entered by the user in the task input field. Must be non-empty after trimming.
- Submit trigger: one of:
  - Button click on `<button id="add-task-btn">`
  - `keydown` event with `event.key === "Enter"` on the text input

### Outputs

- **Success:** A new Task object appended to `tasks[]`, persisted in local storage, and rendered as the last Task Row in the list. Input field is cleared.
- **Validation failure:** No task created; validation error message shown beneath the input. Input retains its current (empty) value and remains focused.

---

### Validation

- `trimmedTitle` must be a non-empty string (length ≥ 1 after trimming).
- There is no maximum title length enforced in v1, but the UI may truncate display for very long titles (truncation is a display concern only — the full title is stored).
- Duplicate titles are permitted in v1 (same title may appear multiple times in the list).
- The generated `id` must be unique within the current `tasks` array. If a collision is detected (extremely unlikely with UUID v4), regenerate the id before appending.

---

### Error States

| Scenario | Behaviour | Error Code | User-Visible Message |
|----------|-----------|------------|----------------------|
| Empty or whitespace-only input | Task not created; validation message shown | `TASK_TITLE_EMPTY` | `"Task title cannot be empty."` |
| `saveTasks` throws `QuotaExceededError` | Task rolled back from `tasks[]`; error message shown | `STORAGE_QUOTA_EXCEEDED` | `"Storage full. Delete some tasks to free space."` |
| `saveTasks` throws any other storage error | Task rolled back from `tasks[]`; error message shown | `STORAGE_WRITE_FAILED` | `"Could not save task. Please try again."` |
| `id` generation produces a duplicate | Regenerate `id` silently; no user-visible effect | `TASK_ID_COLLISION` | None |

---

### API Surface (this feature)

See `Y1-api.md §TaskStore` for full signatures.

| Function | Signature | Role in F01 |
|----------|-----------|-------------|
| `addTask` | `(title: string) → Task \| Error` | Validates title, creates Task, appends to array, calls `saveTasks`, triggers `renderTaskList` |
| `saveTasks` | `(tasks: Task[]) → void` | Persists task array (see F4) |
| `renderTaskList` | `(tasks: Task[]) → void` | Re-renders list after addition (see F0) |

---

### Schema Surface (this feature)

Creates new `Task` objects — see `Y0-schema.md §Task` for field definitions.

---

---

## F02: Mark Task Complete

**PRD Reference:** F2 | **Priority:** P0 (Critical — MVP)

**Description:** Every Task Row in the list contains a checkbox control that reflects and controls the task's `completed` boolean field. Clicking the checkbox toggles the task between complete and incomplete states. The change is applied to the in-memory task array, persisted to local storage (see F4), and reflected in the UI immediately — completed tasks receive a visual strikethrough treatment. The toggle is fully reversible; a completed task can be un-completed by clicking again.

---

### Terminology

- **Completion Toggle:** The `<input type="checkbox">` element rendered in each Task Row.
- **Completed State:** `task.completed === true` — task is done.
- **Incomplete State:** `task.completed === false` — task is pending.
- **Visual Indicator:** CSS styling applied to the task title element when `completed === true` — minimally `text-decoration: line-through`. Optionally a reduced-opacity or muted colour may also be applied.
- **Toggle:** The act of flipping `completed` from `false` to `true` or from `true` to `false`.

---

### Sub-Features

- Checkbox rendered on every Task Row, reflecting the current `completed` state
- Click toggles `completed` between `true` and `false`
- Immediate visual update (strikethrough applied / removed)
- Completion state auto-saved to local storage after every toggle
- Persisted state survives page refresh (checkbox is re-rendered in the correct state on reload)
- Un-complete a task (toggle is fully reversible)

---

### Process

1. `renderTaskList(tasks)` renders each Task Row (see F0 §Process step 5).
2. The checkbox for task `T` is rendered with `checked` attribute set if `T.completed === true`.
3. User clicks the checkbox for task `T`.
4. App's `change` event handler fires on the checkbox element.
5. App identifies task `T` by reading `taskId` from the checkbox's `data-task-id` attribute.
6. App finds `T` in the `tasks` array by `id`.
7. App sets `T.completed = !T.completed` (flip the boolean).
8. App calls `saveTasks(tasks)` (see F4 §Process) to persist the updated array.
9. App calls `renderTaskList(tasks)` (see F0 §Process) to re-render the list with the new state.
   - The checkbox for `T` now reflects the new `completed` value.
   - If `T.completed === true`, the title element has `text-decoration: line-through`.
   - If `T.completed === false`, the strikethrough is removed.

---

### Inputs

- `taskId` (string, internal): Identifier of the task to toggle, read from `data-task-id` on the checkbox element.
- User interaction: `change` event on the checkbox `<input type="checkbox" data-task-id="{id}">`.

### Outputs

- **Toggle to complete:** `task.completed` set to `true`; local storage updated; Task Row re-rendered with strikethrough title and checked checkbox.
- **Toggle to incomplete:** `task.completed` set to `false`; local storage updated; Task Row re-rendered with normal title and unchecked checkbox.

---

### Validation

- The `taskId` read from `data-task-id` must resolve to an existing task in `tasks[]`. If not found (stale DOM), the toggle is aborted silently and `renderTaskList` is called to resync the DOM.
- `completed` must always be a strict boolean (`true` or `false`); never `1`/`0` or a string.
- The toggle must not affect any other field of the Task object (`title`, `id`, `createdAt` remain unchanged).

---

### Error States

| Scenario | Behaviour | Error Code | User-Visible Message |
|----------|-----------|------------|----------------------|
| `taskId` not found in `tasks[]` | Abort toggle; call `renderTaskList` to resync DOM | `TASK_NOT_FOUND` | None (silent resync) |
| `saveTasks` throws `QuotaExceededError` | Revert `completed` to prior value; show error message | `STORAGE_QUOTA_EXCEEDED` | `"Storage full. Delete some tasks to free space."` |
| `saveTasks` throws any other storage error | Revert `completed` to prior value; show error message | `STORAGE_WRITE_FAILED` | `"Could not save change. Please try again."` |

---

### API Surface (this feature)

See `Y1-api.md §TaskStore` for full signatures.

| Function | Signature | Role in F02 |
|----------|-----------|-------------|
| `toggleTask` | `(taskId: string) → void` | Finds task, flips `completed`, calls `saveTasks`, triggers `renderTaskList` |
| `saveTasks` | `(tasks: Task[]) → void` | Persists updated array (see F4) |
| `renderTaskList` | `(tasks: Task[]) → void` | Re-renders list to reflect new completion state (see F0) |

---

### Schema Surface (this feature)

Mutates the `completed` field of an existing `Task` — see `Y0-schema.md §Task`.

---

---

## F03: Delete Task

**PRD Reference:** F3 | **Priority:** P0 (Critical — MVP)

**Description:** Each Task Row contains a delete control (button or icon) that permanently removes that task from both the in-memory task array and local storage. Deletion is immediate — the task disappears from the list in the same event-loop tick as the click. There is no confirmation dialog in v1; the interaction is intentionally fast. Undo is out of scope for v1.

---

### Terminology

- **Delete Control:** The `<button>` element in each Task Row that triggers deletion. Labelled "Delete" (text) or carrying `aria-label="Delete task"` (icon variant).
- **Permanent Removal:** Deletion cannot be undone in v1; once removed from the array and local storage, the task is gone.
- **Spliced Array:** The `tasks[]` array after the deleted task has been removed via `Array.prototype.splice` or `Array.prototype.filter`.

---

### Sub-Features

- Delete button/icon rendered on every Task Row
- Single click permanently removes the task from the list
- Task is removed from local storage immediately
- List re-renders instantly to reflect the deletion
- If deleting the last task, the empty-state message is displayed (see F0 §Process step 4a)
- No confirmation dialog

---

### Process

1. `renderTaskList(tasks)` renders each Task Row with a delete button: `<button data-task-id="{id}" aria-label="Delete task">Delete</button>`.
2. User clicks the delete button for task `T`.
3. App's `click` event handler fires.
4. App reads `taskId` from the button's `data-task-id` attribute.
5. App finds the index of `T` in `tasks[]` by `id`.
6. App removes `T` from the array: `tasks = tasks.filter(t => t.id !== taskId)` (or equivalent splice).
7. App calls `saveTasks(tasks)` (see F4 §Process) to persist the updated (shorter) array.
8. App calls `renderTaskList(tasks)` (see F0 §Process) to re-render the list.
   - If `tasks.length === 0`, the empty-state message is displayed.
   - Otherwise, the deleted Task Row is absent from the new render.

---

### Inputs

- `taskId` (string, internal): Identifier of the task to delete, read from `data-task-id` on the delete button.
- User interaction: `click` event on `<button data-task-id="{id}">`.

### Outputs

- **Success:** Task removed from `tasks[]`; local storage updated; Task Row no longer present in the rendered list. If array is now empty, empty-state message shown.
- **Task not found:** No mutation; `renderTaskList` called to resync DOM (see Error States).

---

### Validation

- The `taskId` read from `data-task-id` must resolve to a task in `tasks[]`. If not found (stale DOM), delete is aborted and the DOM is resynced.
- After deletion, `tasks[]` must not contain any item with the deleted `id`.
- `saveTasks` must be called before `renderTaskList` to ensure persistence is confirmed before the DOM update reflects the removal.

---

### Error States

| Scenario | Behaviour | Error Code | User-Visible Message |
|----------|-----------|------------|----------------------|
| `taskId` not found in `tasks[]` | Abort delete; call `renderTaskList` to resync DOM | `TASK_NOT_FOUND` | None (silent resync) |
| `saveTasks` throws `QuotaExceededError` | Revert deletion (re-add task to array); show error | `STORAGE_QUOTA_EXCEEDED` | `"Storage full. Could not save changes."` |
| `saveTasks` throws any other storage error | Revert deletion (re-add task to array); show error | `STORAGE_WRITE_FAILED` | `"Could not delete task. Please try again."` |

---

### API Surface (this feature)

See `Y1-api.md §TaskStore` for full signatures.

| Function | Signature | Role in F03 |
|----------|-----------|-------------|
| `deleteTask` | `(taskId: string) → void` | Removes task from array, calls `saveTasks`, triggers `renderTaskList` |
| `saveTasks` | `(tasks: Task[]) → void` | Persists shortened array (see F4) |
| `renderTaskList` | `(tasks: Task[]) → void` | Re-renders list after deletion (see F0) |

---

### Schema Surface (this feature)

Removes an item from the persisted `Task[]` array — see `Y0-schema.md §Task` and `Y0-schema.md §Storage Layout`.

---

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

---

## Y0: Local Storage Data Schema

This section defines the complete data model for TodoApp v1. There is no relational database — all data lives in `window.localStorage` as a single JSON-serialised array.

---

### §Task — Object Schema

Each task in the list is represented by a `Task` object with the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the task. Generated client-side at creation time as a UUID v4 or a `Date.now().toString(36)` monotonic string. Must be non-empty and unique within the array. |
| `title` | `string` | Yes | The task title entered by the user. Trimmed of leading/trailing whitespace at creation. Must be non-empty (length ≥ 1 after trim). |
| `completed` | `boolean` | Yes | Whether the task has been marked complete. Always `false` at creation. Toggled by F2. |
| `createdAt` | `number` | Recommended | Unix timestamp in milliseconds (`Date.now()`) recording when the task was created. Used for stable sort order. Treated as `0` if absent (backwards-compatibility). |

**TypeScript-style interface (for implementation reference):**

```typescript
interface Task {
  id: string;          // non-empty, unique within tasks[]
  title: string;       // non-empty after trim
  completed: boolean;  // false on creation
  createdAt: number;   // Date.now() on creation; 0 if missing
}
```

**Example Task object:**

```json
{
  "id": "lf3k9m2p",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": 1746700800000
}
```

---

### §Storage Layout — Local Storage Key

| Key | Value Type | Description |
|-----|-----------|-------------|
| `"todoapp_tasks"` | JSON string | A serialised `Task[]` array. Absent on first run; written by `saveTasks()` after every mutation; read by `loadTasks()` on every page load. |

**Wire format example (pretty-printed for readability; actual stored value is compact JSON):**

```json
[
  {
    "id": "lf3k9m2p",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": 1746700800000
  },
  {
    "id": "lf3k9m4q",
    "title": "Walk the dog",
    "completed": true,
    "createdAt": 1746701000000
  }
]
```

**Storage constraints:**

- The entire task list is stored as a single JSON string under one key (`"todoapp_tasks"`).
- There are no secondary keys, no indexes, and no versioning header in v1.
- Local storage quota is browser-dependent (typically 5–10 MB per origin). A `QuotaExceededError` will be thrown by the browser when the limit is reached (see `Y2-errors.md §STORAGE_QUOTA_EXCEEDED`).
- Data is origin-scoped: tasks created on `localhost:3000` are not visible on `localhost:5000` or on a deployed URL.

---

### §Invariants

The following invariants must hold at all times in the in-memory `tasks[]` array and in the persisted JSON:

1. **Uniqueness:** No two tasks share the same `id`.
2. **Non-empty title:** Every task's `title` is a non-empty string after trimming.
3. **Boolean completed:** `completed` is always `true` or `false`; never `null`, `undefined`, `0`, `1`, or a string.
4. **Array order:** The array order represents the display order. New tasks are appended to the end (highest index).
5. **No orphans:** Every task in local storage corresponds to a task that was explicitly created by the user via F1 and has not been deleted via F3.

---

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
