---

## Interaction Patterns

### Pattern 01: Submit and Refocus (Add Task)

**User Stories:** US-1.1, US-1.2
**Journey:** JRN-02.1 Stage 2–3 (Priya — Rapid Batch Entry)

**When to use:** Every time a task is successfully submitted, whether via Enter key or button click.

**Behaviour:**
1. User submits form (Enter or click).
2. Validation passes.
3. `addTask()` is called synchronously.
4. `saveTasks()` persists; `renderTaskList()` updates DOM — new row appears at bottom of list.
5. `inputElement.value = ""` — input is cleared.
6. `inputElement.focus()` — cursor returns to input immediately.
7. User can type the next task without touching the mouse.

**Why it matters:** This pattern is the keystone of Priya's keyboard-only workflow (JRN-02.1). Without refocus, every task entry requires a mouse click or Tab keypress — transforming a 60-second habit into a 3-minute chore. Marcus also benefits in JRN-01.2 (rapid back-to-back capture).

**Key timing constraint:** The clear + refocus must happen within the same synchronous call stack as the submit event — no `setTimeout` wrapper. Users notice any delay > 50 ms as a stutter.

---

### Pattern 02: Immediate Mutation Feedback

**User Stories:** US-0.3, US-2.1, US-3.1
**Journey:** All action flows

**When to use:** Every add, toggle, and delete action.

**Behaviour:**
1. User triggers action (click or key).
2. In-memory `tasks[]` mutated immediately.
3. `saveTasks()` called (synchronous localStorage write).
4. `renderTaskList()` called — DOM updated in same event-loop tick.
5. User sees result before the browser even paints the next frame.

**Visual timing target:** < 50 ms from interaction to visible DOM change (PRD NFR). Since localStorage writes are synchronous and the app has no network round-trips, this is achievable.

---

### Pattern 03: Optimistic Revert on Storage Error

**User Stories:** US-1.4, US-2.4, US-3.3
**Journey:** Error branches in Flows 00, 02, 03

**When to use:** Any time `saveTasks()` throws.

**Behaviour:**
1. In-memory mutation is applied (add/toggle/delete).
2. `saveTasks()` throws (`STORAGE_QUOTA_EXCEEDED` or `STORAGE_WRITE_FAILED`).
3. **Revert:** in-memory mutation is undone:
   - Add: `tasks.pop()` (or `tasks.splice(index, 1)`)
   - Toggle: `task.completed = priorValue`
   - Delete: `tasks.splice(originalIndex, 0, task)` (re-insert at original position)
4. `renderTaskList()` called — DOM reflects reverted (stored) state.
5. Error banner shown with appropriate message.
6. Banner auto-dismisses after 5 s or on next successful operation.

**Why revert first, then render:** The displayed state must always match the stored state. Showing a task as deleted when it still exists in localStorage — or showing a task as added when it wasn't saved — breaks the user's mental model of persistence.

---

### Pattern 04: Auto-Dismiss Error Banner

**User Stories:** US-1.4, US-2.4, US-3.3

**When to use:** After any storage error banner is shown.

**Behaviour:**
1. Banner appears (see Screen 02).
2. A 5-second timer starts (`setTimeout`).
3. **Either:**
   - Timer expires → banner fades out automatically.
   - User clicks `[✕]` → banner removed immediately.
   - User performs a successful operation → banner removed (confirms issue resolved).

**Banner ARIA:** `<div role="alert" aria-live="assertive">` — screen readers announce the error immediately when it appears.

---

### Pattern 05: Empty State Toggle

**User Stories:** US-0.2, US-0.3, US-3.2

**When to use:** Whenever the task count transitions between 0 and > 0 in either direction.

**Behaviour (0 → 1):**
- `renderTaskList()` detects `tasks.length > 0`
- Hides empty-state element (`display: none`)
- Shows task list container
- New task row visible immediately

**Behaviour (1 → 0):**
- Last task deleted or no tasks on load
- `renderTaskList()` detects `tasks.length === 0`
- Hides task list container
- Shows empty-state element: `"No tasks yet — add one above!"`

**No animation required** — the toggle is instantaneous; no fade needed. The empty-state message is the sole UI affordance for new users.

---

### Pattern 06: Inline Validation Error

**User Stories:** US-1.3

**When to use:** User attempts to submit an empty or whitespace-only task title.

**Behaviour:**
1. Submit action fires.
2. `title.trim() === ""` check fails.
3. Inline error message element becomes visible below the input: `"Task title cannot be empty."`
4. Error element styled in red/error colour.
5. Input keeps focus; input border may turn red as additional indicator.
6. No task created; `tasks[]` and localStorage unchanged.
7. When user next **successfully** submits a task → error message is hidden/cleared.

**Note:** The error message is **not** auto-dismissed on a timer — it persists until the user takes a corrective action. This avoids the error "blinking away" before the user reads it.

---
