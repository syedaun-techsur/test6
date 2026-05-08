---

### Flow 02: Toggle Task Completion

**Trigger:** User clicks a task's checkbox
**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4
**Journey:** JRN-02.2 (Priya — Mid-Day Progress Tracking)

```
[User clicks checkbox on task row]
        │
        ▼
[toggleTask(taskId)]
        │
        ├── taskId not found in tasks[] (stale DOM)
        │   ──▶ [renderTaskList() to resync; no user message]
        │
        └── taskId found
                │
                ▼
        [task.completed = !task.completed  (in-memory flip)]
                │
                ▼
        [saveTasks(tasks)]
                │
                ├── throws QuotaExceededError
                │   ──▶ [Revert task.completed to prior value]
                │        [renderTaskList() — shows reverted state]
                │        [Error banner: "Storage full. Delete some tasks..."]
                │        [Banner auto-dismisses after 5 s]
                │
                ├── throws other error
                │   ──▶ [Revert task.completed to prior value]
                │        [renderTaskList() — shows reverted state]
                │        [Error banner: "Could not save change. Please try again."]
                │
                └── success
                        │
                        ▼
                [renderTaskList(tasks)]
                  - Checkbox now checked/unchecked
                  - Title gains or loses strikethrough + muted colour
                  - Change visible within same event-loop tick
                        │
                        ▼
                [EXIT: same screen; updated visual state]
```

**Steps:**
1. **Checkbox click** — `change` event fires; `taskId` read from `data-task-id` attribute (US-2.1).
2. **In-memory toggle** — `completed` boolean flipped; no other fields mutated (US-2.1, US-2.2).
3. **Persist** — `saveTasks()` called before DOM update (US-4.1).
4. **Visual update** — strikethrough and muted colour applied/removed immediately (US-0.4, US-2.1).
5. **Error → revert** — on storage failure, `completed` returns to prior value; UI reflects accurate stored state (US-2.4).
6. **Persistence across refresh** — state survives page reload because localStorage was written (US-2.3).

---

### Flow 03: Delete a Task

**Trigger:** User clicks the Delete button (or trash icon) on a task row
**User Stories:** US-3.1, US-3.2, US-3.3
**Journey:** JRN-01.2, JRN-02.3

```
[User clicks Delete button on task row]
        │
        ▼
[deleteTask(taskId)]
        │
        ├── taskId not found in tasks[] (stale DOM)
        │   ──▶ [renderTaskList() to resync; no user message]
        │
        └── taskId found
                │
                ▼
        [tasks = tasks.filter(t => t.id !== taskId)  (in-memory remove)]
                │
                ▼
        [saveTasks(tasks)]
                │
                ├── throws QuotaExceededError
                │   ──▶ [Re-insert task at original index]
                │        [renderTaskList() — task reappears]
                │        [Error banner: "Storage full. Could not save changes."]
                │
                ├── throws other error
                │   ──▶ [Re-insert task at original index]
                │        [renderTaskList() — task reappears]
                │        [Error banner: "Could not delete task. Please try again."]
                │
                └── success
                        │
                        ▼
                [renderTaskList(tasks)]
                        │
                        ├── tasks.length > 0
                        │   ──▶ [Task row removed; remaining list intact]
                        │
                        └── tasks.length === 0
                            ──▶ [EMPTY STATE: "No tasks yet — add one above!"]
                                 Task list container hidden
                        │
                        ▼
                [EXIT: same screen; task gone]
```

**Steps:**
1. **Delete click** — single click, no confirmation dialog (US-3.1); `taskId` read from `data-task-id`.
2. **In-memory removal** — task filtered out of `tasks[]` immediately.
3. **Persist** — `saveTasks()` called before DOM update.
4. **Immediate removal** — task row gone within same event-loop tick (US-3.1).
5. **Empty state** — if last task deleted, empty-state message reappears (US-3.2, US-0.3).
6. **Error → revert** — task re-inserted at original position; error banner shown (US-3.3).

---
