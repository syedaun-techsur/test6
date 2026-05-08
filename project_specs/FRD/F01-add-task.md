
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
