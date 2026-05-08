
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
