---

## User Flows

### Flow 00: First-Time Use — Empty State to First Task

**Trigger:** User opens the app URL for the first time (no tasks in localStorage)
**User Stories:** US-0.2, US-1.1, US-1.2, US-4.3
**Journey:** JRN-01.1 (Marcus — First-Time Task Capture)

```
[User opens app URL]
        │
        ▼
[DOMContentLoaded fires]
        │
        ▼
[loadTasks() → returns [] (no key in localStorage)]
        │
        ▼
[Render: EMPTY STATE]
  - Add form visible, input auto-focused
  - Empty-state message: "No tasks yet — add one above!"
  - Task list container hidden
        │
        ▼
[User types task title in input]
        │
        ▼
[User presses Enter OR clicks "Add Task" button]
        │
        ├── Input is empty/whitespace ──▶ [Show inline validation error]
        │                                   "Task title cannot be empty."
        │                                   Input stays focused
        │                                   ↩ (user corrects and retries)
        │
        └── Input has content ──▶ [addTask(title)]
                                        │
                                        ├── saveTasks() throws QuotaExceededError
                                        │   ──▶ [Roll back task; show error banner]
                                        │        "Storage full. Delete some tasks..."
                                        │
                                        ├── saveTasks() throws other error
                                        │   ──▶ [Roll back task; show error banner]
                                        │        "Could not save task. Please try again."
                                        │
                                        └── saveTasks() succeeds
                                                │
                                                ▼
                                        [renderTaskList(tasks)]
                                          - Empty state disappears
                                          - Task row appears immediately
                                          - Input cleared, focus returned to input
                                                │
                                                ▼
                                        [EXIT: Populated state]
                                          User can add more tasks,
                                          toggle, or delete
```

**Steps:**
1. **App loads** — `loadTasks()` returns `[]`; empty-state rendered; input receives autofocus (US-0.2, US-4.3).
2. **User types** — input accepts free text; no character limit enforced in v1.
3. **User submits** — via Enter key (US-1.2) or "Add Task" button (US-1.1); both paths identical.
4. **Validation** — empty/whitespace input shows inline error; no task created, input stays focused (US-1.3).
5. **Task created** — new task appended to list; empty state hides; input cleared and refocused (US-1.1, US-0.3).
6. **Storage error** — task rolled back; error banner shown with auto-dismiss after 5 s (US-1.4).

---

### Flow 01: Returning User — Page Load with Existing Tasks

**Trigger:** User returns to the app (tasks exist in localStorage); includes browser refresh and restart
**User Stories:** US-0.1, US-0.4, US-4.2, US-4.4, US-4.5
**Journey:** JRN-01.3, JRN-02.2

```
[User opens / refreshes app]
        │
        ▼
[DOMContentLoaded fires]
        │
        ▼
[loadTasks()]
        │
        ├── localStorage.getItem throws (SecurityError)
        │   ──▶ [tasks = []; log warn; show EMPTY STATE silently]
        │        App works in-memory for session only (US-4.5)
        │
        ├── Key missing (first run or cleared)
        │   ──▶ [tasks = []; show EMPTY STATE]
        │
        ├── JSON corrupt / not an array
        │   ──▶ [removeItem; tasks = []; log warn; show EMPTY STATE silently]
        │        (US-4.4)
        │
        └── Valid JSON array
                │
                ▼
        [Filter: skip malformed task objects; keep valid ones]
        [tasks = filtered array]
                │
                ▼
        [renderTaskList(tasks)]
          - Each task renders with correct completion state
          - Completed tasks: strikethrough + muted colour
          - Pending tasks: normal style
          - Input auto-focused, ready for new entries
                │
                ▼
        [EXIT: Populated state — user sees their list exactly as left]
```

**Steps:**
1. **App loads** — `loadTasks()` attempts to read localStorage (US-4.2).
2. **Storage unavailable** — silent fallback to empty state; session-only mode (US-4.5).
3. **Corrupt data** — key cleared, app starts fresh with no user-visible error (US-4.4).
4. **Valid data** — tasks rendered in insertion order; completion states restored accurately (US-0.1, US-0.4, US-2.3).

---
