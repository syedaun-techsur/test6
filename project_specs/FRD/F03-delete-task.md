
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
