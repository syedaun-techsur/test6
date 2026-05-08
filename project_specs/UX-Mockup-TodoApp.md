# UX Mockup — TodoApp

**Project:** TodoApp — Basic To-Do App
**Version:** 1.0
**Generated:** 2026-05-08
**Based on:** UserStories-TodoApp.md, PRD-TodoApp.md, FRD-TodoApp.md, JOURNEYS-TodoApp.md

---

## Overview

### UX Approach

TodoApp is a **single-screen, zero-friction** personal task manager. Every UX decision is shaped by two north-star constraints from the journey research:

1. **First task in < 30 seconds** — no gates, no onboarding, no scrolling required to reach the input.
2. **Persistence must feel invisible** — the app never shows a "Save" button or loading state for reads; tasks simply appear where the user left them.

### Design Principles

| Principle | Rationale |
|-----------|-----------|
| **Input always above the fold** | Both personas (JRN-01.1, JRN-02.3) need to add a task without scrolling. The add-form is pinned and never displaced by a growing list. |
| **Instant visual feedback (< 50 ms)** | Any perceptible lag on add, toggle, or delete erodes trust. UI state must change within the same event-loop tick as the user action. |
| **No confirmation dialogs on delete** | Marcus (JRN-01.2) and Priya (JRN-02.3) are always in split-attention or time-pressured states when they delete. A modal would train them away from the feature. |
| **Clear done/pending visual split** | Strikethrough + muted colour on completed items lets Priya (JRN-02.2) scan a mixed list and orient in < 5 seconds. |
| **Empty state as onboarding** | A single action-prompting message replaces any onboarding wizard for first-time users (JRN-01.1, JRN-02.1). |
| **Graceful silent fallbacks** | Storage errors on load (private browsing, corruption) never show a broken screen — the app silently starts fresh. |

### Single-Screen Architecture

TodoApp is a **one-page application** with no navigation, no modals, and no routing. The entire UI lives on a single HTML document. There are no separate screens to navigate between — only **states** of the same screen.

```
┌─────────────────────────────────────────────────┐
│                  TODOAPP SCREEN                  │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  ADD FORM (pinned, always visible)       │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  ERROR BANNER (conditional)              │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  TASK LIST  ──or──  EMPTY STATE          │   │
│  │  (mutually exclusive; scrollable)        │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Screen States Summary

| State | Trigger | What Renders |
|-------|---------|--------------|
| **Empty** | No tasks in storage (first run, all deleted) | Add form + empty-state message |
| **Populated** | One or more tasks exist | Add form + scrollable task list |
| **Validation Error** | Empty input submitted | Add form with inline error message below input |
| **Storage Error** | QuotaExceeded or write failure | Add form + task list + dismissible error banner |
| **Session-only** | localStorage unavailable (private browsing) | Add form + empty state (silent; tasks work in-memory only) |

---
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
---

## Screen Designs

### Screen 00: Main Screen — Empty State

**Purpose:** First-run and zero-tasks state; guides user to create their first task
**User Stories:** US-0.2, US-1.1, US-1.2, US-1.3, US-4.3, US-4.5
**Journey:** JRN-01.1 Stage 1–2, JRN-02.1 Stage 1

#### Layout

```
┌──────────────────────────────────────────────────┐
│                   TodoApp                        │
│              ── Personal Task List ──            │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  [_____ What needs to be done? _________]  │  │
│  │                            [Add Task ▶]    │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│                                                  │
│           No tasks yet — add one above!          │
│                                                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Key layout notes:**
- App title is minimal — single heading, no navigation chrome
- Add form region is visually distinct (card/panel style) and sits at top
- Text input spans most of the form width; "Add Task" button sits inline to the right
- Empty-state message is centered below the form, styled in muted/secondary colour
- Input receives **autofocus on load** — cursor is immediately ready for typing
- No scroll required — everything visible above the fold

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Task input field | Top of content, full-width, autofocused |
| Primary | "Add Task" button | Inline right of input, always visible |
| Secondary | App title / heading | Top of page, minimal styling |
| Tertiary | Empty-state message | Below form, muted colour |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| **Default** | Input placeholder text visible; cursor in input | Autofocus — no extra action needed |
| **Typing** | Input has text content; placeholder hidden | None — standard input behaviour |
| **Validation Error** | Red/error border on input; inline error message below input | `"Task title cannot be empty."` in error colour |
| **Submitting** | (synchronous — no loading state needed) | Task appears in list immediately |

#### Interactive Elements

| Element | Type | Behaviour |
|---------|------|-----------|
| Task input field | `<input type="text">` | Accepts task title; Enter key triggers submit; autofocused on load and after each submission |
| "Add Task" button | Primary CTA `<button>` | Triggers same submit action as Enter key; disabled appearance when input is empty (optional enhancement) |
| Inline validation error | `<span>` / `<p>` | Appears below input on empty submit; cleared on next successful submission |

---

### Screen 01: Main Screen — Populated State

**Purpose:** Active working view; user sees, toggles, and deletes tasks
**User Stories:** US-0.1, US-0.3, US-0.4, US-2.1, US-2.2, US-3.1, US-4.1, US-4.2
**Journey:** JRN-01.2, JRN-01.3, JRN-02.2, JRN-02.3

#### Layout

```
┌──────────────────────────────────────────────────┐
│                   TodoApp                        │
│              ── Personal Task List ──            │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  [_____ What needs to be done? _________]  │  │
│  │                            [Add Task ▶]    │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ ☑  ~~Buy groceries~~                  [🗑] │  │  ← completed (strikethrough + muted)
│  ├────────────────────────────────────────────┤  │
│  │ ☐  Call accountant – Thursday         [🗑] │  │  ← pending (normal weight)
│  ├────────────────────────────────────────────┤  │
│  │ ☐  Review proposal – EOD              [🗑] │  │  ← pending
│  ├────────────────────────────────────────────┤  │
│  │ ☑  ~~Attend standup~~                 [🗑] │  │  ← completed
│  ├────────────────────────────────────────────┤  │
│  │ ☐  Budget call                        [🗑] │  │  ← pending
│  └────────────────────────────────────────────┘  │
│    ↑ scrollable when list exceeds viewport        │
└──────────────────────────────────────────────────┘
```

**Key layout notes:**
- Add form **remains pinned at top** — always accessible regardless of list length (US-1.1, JRN-02.3)
- Task list is a scrollable region below the form
- Each task row is a full-width item; consistent row height
- Checkbox on the left; task title in the middle; delete icon/button on the right
- Completed tasks: **strikethrough** on title text + **muted/grey colour** (US-0.4)
- Pending tasks: **normal weight**, full colour
- Delete button uses trash icon with `aria-label="Delete task"` (US-3.1, accessibility)

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Task input + Add button | Pinned top section |
| Primary | Pending task titles | Full colour, normal weight, in task rows |
| Secondary | Completion checkboxes | Left side of each task row |
| Secondary | Delete button | Right side of each task row |
| Tertiary | Completed task titles | Muted colour + strikethrough; visually de-emphasised |

#### Task Row Anatomy

```
┌────────────────────────────────────────────────────┐
│  [☐/☑]   Task Title Text                   [🗑]   │
│  │ ↑          ↑                               ↑    │
│  │ checkbox   title span                  delete btn│
│  │ data-task-id="{id}"                             │
└────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| **Default (pending)** | `☐` checkbox; normal weight title; full colour | None |
| **Default (completed)** | `☑` checkbox; `~~strikethrough~~` title; muted/grey colour | Visual distinction confirms done status |
| **Hover on row** | Subtle background highlight; delete button becomes more visible | Affordance for delete action |
| **Adding new task** | New row appends to bottom of list instantly | Input clears; focus returns to input |
| **Toggling** | Checkbox state flips; strikethrough applies/removes immediately | Visual change within same tick |
| **Deleting** | Row removed immediately; list collapses | No confirmation; instant removal |
| **Last task deleted** | Task list hides; empty-state message appears | `"No tasks yet — add one above!"` |

#### Interactive Elements

| Element | Type | Behaviour |
|---------|------|-----------|
| Task input field | `<input type="text">` | Same as empty state; always available at top |
| "Add Task" button | Primary CTA | Same as empty state |
| Task checkbox | `<input type="checkbox">` | `change` event → `toggleTask(id)`; immediate visual update |
| Task title span | Non-interactive text | Styled based on `completed` state |
| Delete button | `<button aria-label="Delete task">` | `click` → `deleteTask(id)`; no confirmation dialog |

---

### Screen 02: Main Screen — Storage Error State

**Purpose:** Notify user of a failed save while keeping the app functional
**User Stories:** US-1.4, US-2.4, US-3.3
**Journey:** Error branch in all action flows

#### Layout

```
┌──────────────────────────────────────────────────┐
│                   TodoApp                        │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  [_____ What needs to be done? _________]  │  │
│  │                            [Add Task ▶]    │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ ⚠  Storage full. Delete some tasks to     │  │
│  │    free space.                      [✕]   │  │  ← dismissible banner
│  └────────────────────────────────────────────┘  │
│                                                  │
│  [... task list (unchanged — action reverted) ...]│
│                                                  │
└──────────────────────────────────────────────────┘
```

**Key layout notes:**
- Error banner appears **between the add form and the task list**
- Banner uses a warning colour (amber/orange) with ⚠ icon
- Banner has an explicit `[✕]` dismiss button
- Banner **auto-dismisses after 5 seconds** (US-1.4, US-2.4, US-3.3)
- The in-memory mutation is **always reverted** before the banner shows — the list reflects actual stored state
- App remains fully functional; user can retry actions

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| **QuotaExceeded** | Amber banner with ⚠ icon | `"Storage full. Delete some tasks to free space."` |
| **Write failed (add)** | Amber banner | `"Could not save task. Please try again."` |
| **Write failed (toggle)** | Amber banner | `"Could not save change. Please try again."` |
| **Write failed (delete)** | Amber banner | `"Could not delete task. Please try again."` |
| **Auto-dismiss** | Banner fades out after 5 s | Clears without user interaction |
| **Manual dismiss** | User clicks `[✕]` | Banner clears immediately |
| **Next success** | Banner clears on successful operation | Positive reinforcement that the issue is resolved |

#### Interactive Elements

| Element | Type | Behaviour |
|---------|------|-----------|
| Error banner | `<div role="alert">` | Visible when storage error occurs; dismissed after 5 s or on user click |
| Dismiss button `[✕]` | `<button aria-label="Dismiss error">` | Immediately removes banner |

---
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
---

## Responsive Considerations

TodoApp is a single-column, vertically-stacked layout. Responsive design is straightforward — no major layout restructuring is needed across breakpoints.

**PRD constraint:** "Usable on mobile screen widths (≥ 320 px) and desktop widths; layout adapts without horizontal scroll."

---

### Desktop (> 768 px)

```
┌────────────────────────────────────────────────────┐
│              TodoApp                               │
│         Personal Task List                        │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  [___ What needs to be done? ____________]   │  │
│  │                          [  Add Task  ▶  ]   │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ ☐  Review proposal – EOD              [🗑]   │  │
│  ├──────────────────────────────────────────────┤  │
│  │ ☑  ~~Buy groceries~~                  [🗑]   │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
  Max content width: ~600–700 px, centered on wide screens
```

- Content area capped at ~600–700 px max-width, centered with auto margins
- Input field and button sit comfortably inline on the same row
- Task rows have generous horizontal padding
- Delete button visible on hover (desktop) or always visible (simpler approach)
- Adequate vertical spacing between task rows (min 44 px touch target, even on desktop for consistency)

---

### Tablet (481 px – 768 px)

- Same single-column layout as desktop
- Max-width constraint relaxed or removed (full-width with padding)
- Input + button remain inline on the same row — sufficient horizontal space
- Touch targets: checkbox and delete button minimum 44 × 44 px
- Delete button: consider **always visible** rather than hover-only (touch has no hover state)

---

### Mobile (320 px – 480 px)

```
┌──────────────────────────────┐
│        TodoApp               │
│     Personal Task List       │
│                              │
│  ┌──────────────────────┐    │
│  │ What needs doing?    │    │  ← input, full width
│  └──────────────────────┘    │
│  ┌──────────────────────┐    │
│  │     Add Task ▶       │    │  ← button, full width below input
│  └──────────────────────┘    │
│                              │
│  ☐  Review proposal – EOD  🗑│  ← row compressed
│  ────────────────────────────│
│  ☑  ~~Buy groceries~~      🗑│
│  ────────────────────────────│
└──────────────────────────────┘
```

**Key mobile adjustments:**
- Add button stacks **below** the text input (full-width block button) when inline layout is too cramped (< ~380 px)
- Input field is full-width
- Task title text wraps to a second line for long titles — row height expands; delete button aligns to top-right of row
- Checkbox and delete icon: minimum 44 × 44 px tap target (WCAG 2.5.5 AAA; 24 × 24 minimum for AA)
- Delete button: **always visible** — no hover dependency on touch devices
- Inline validation error: wraps cleanly below the input, full width
- Error banner: full-width, text wraps as needed; dismiss `[✕]` button touch-friendly

**No horizontal scroll:** Single-column layout with percentage/fluid widths and adequate padding guarantees no overflow at ≥ 320 px.

---

### Viewport Overflow (Long Lists)

- Task list container is a scrollable region (`overflow-y: auto`)
- Add form is **sticky/pinned** at the top — it does not scroll out of view
- On mobile, the sticky add form may use `position: sticky; top: 0` with a background to prevent the list bleeding through
- Scrollbar visible on desktop when list overflows viewport height

---
---

## Accessibility Notes

**PRD requirement:** "Interactive elements (inputs, buttons, checkboxes) are keyboard-navigable and have appropriate ARIA labels."

---

### Colour Contrast

| Element | Requirement | Notes |
|---------|-------------|-------|
| Pending task title text | WCAG AA: min 4.5:1 contrast against background | Normal body text |
| Completed task title (muted/grey) | WCAG AA: min 4.5:1 even when muted | Don't use a grey that falls below 4.5:1 — e.g. `#767676` on white is the minimum passing grey |
| Error message text | WCAG AA: min 4.5:1 against background | Red error text must not be too light |
| Error banner text | WCAG AA: min 4.5:1 | Amber/orange banners require dark text (not white) |
| "Add Task" button label | WCAG AA: min 4.5:1 (text on button background) | Standard button contrast |
| Empty-state message | WCAG AA: min 4.5:1 | Even tertiary/muted copy must pass |

**Note on completion styling:** Strikethrough text communicates completion visually — ensure this is **not the only indicator** for users who cannot perceive text decoration. The checked checkbox state is the semantic indicator; the muted colour is supplementary. Both together ensure multiple redundant cues.

---

### Keyboard Navigation

| Action | Keyboard Interaction |
|--------|---------------------|
| Focus task input on load | Input autofocused on `DOMContentLoaded` — user can type immediately |
| Submit task | `Enter` key while input is focused (US-1.2) |
| Tab through task rows | `Tab` key moves focus: input → Add button → checkbox (row 1) → delete (row 1) → checkbox (row 2) → ... |
| Toggle completion | `Space` key on focused checkbox (native checkbox behaviour) |
| Delete task | `Enter` or `Space` on focused delete button |
| Dismiss error banner | `Enter` or `Space` on focused `[✕]` dismiss button; or `Tab` past it |

**Focus management:**
- After successful task submission: focus **returns to input** (US-1.1, US-1.2).
- After failed (empty) submission: focus **stays on input** (US-1.3).
- After delete: focus behaviour — if the deleted row had focus, move focus to the next row's checkbox or, if the list is now empty, to the input field.
- Error banner: does not steal focus when it appears (it uses `role="alert"` which announces via screen reader without moving keyboard focus).

---

### Screen Reader Support

| Element | ARIA / Semantic Markup | Notes |
|---------|------------------------|-------|
| App heading | `<h1>TodoApp</h1>` | Single page-level heading |
| Add form | `<form>` with `<label for="task-input">` | Associates label with input semantically |
| Task input | `<input type="text" id="task-input" aria-label="New task title">` | Label or aria-label required |
| Add button | `<button type="submit">Add Task</button>` | Descriptive text; no icon-only button |
| Validation error | `<span role="alert" aria-live="polite">` below input | Announced when it appears; `polite` avoids interrupting in-progress speech |
| Task list | `<ul>` or `<ol>` | Semantic list; screen reader announces item count |
| Task row | `<li>` | Each task is a list item |
| Checkbox | `<input type="checkbox" aria-label="Mark '{title}' as complete">` | Dynamic label includes task title for context |
| Delete button | `<button aria-label="Delete task: {title}">` (or at minimum `aria-label="Delete task"`) | Without a label, a trash icon is meaningless to screen readers (US-3.1 specifies `aria-label="Delete task"`) |
| Error banner | `<div role="alert" aria-live="assertive">` | `assertive` interrupts screen reader to announce storage errors immediately |
| Dismiss button | `<button aria-label="Dismiss error">✕</button>` | Icon must have accessible label |
| Empty state | `<p>` or `<div>` with visible text | No ARIA needed; plain text is sufficient |

---

### Focus Indicators

- All interactive elements must have a **visible focus ring** — do not suppress `outline: none` without providing a custom equivalent
- Focus ring should have sufficient contrast: WCAG 2.1 SC 1.4.11 (Non-Text Contrast) requires 3:1 minimum
- Custom focus styles should be additive: `outline` + optional box-shadow for extra visibility

---

### Motion / Animation

- Any append animation on new tasks (e.g., subtle fade-in or slide-in) must respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation: none; transition: none; }
  }
  ```
- The core interactions (add, toggle, delete) are instant — no animation is required; any animation is purely cosmetic and must not delay the visual state change

---

### Touch / Pointer

- Minimum touch target: **44 × 44 px** for checkbox and delete button (WCAG 2.5.5)
- Touch targets must not overlap — sufficient spacing between checkbox and delete button within each row
- No hover-dependent interactions for task management — delete must be always visible or revealed on tap, not only on mouse hover

---

*UX-Mockup generated: 2026-05-08 | Based on: UserStories-TodoApp.md, JOURNEYS-TodoApp.md, PRD-TodoApp.md, FRD-TodoApp.md*
