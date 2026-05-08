
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
