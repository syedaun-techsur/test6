
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
