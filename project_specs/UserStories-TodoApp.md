# User Stories — TodoApp

| Field           | Value                          |
|-----------------|--------------------------------|
| **Product**     | TodoApp — Basic To-Do App      |
| **Version**     | 1.0                            |
| **Date**        | 2026-05-08                     |
| **Related PRD** | PRD-TodoApp.md                 |
| **Related FRD** | FRD-TodoApp.md                 |
| **Personas**    | PERSONAS-TodoApp.md            |
| **Status**      | Draft                          |

---

## Priority Definitions

| Priority | Label    | Description                                              |
|----------|----------|----------------------------------------------------------|
| **P0**   | Critical | Must ship in v1 MVP — app does not function without it   |
| **P1**   | High     | High value; target for v1.1                              |
| **P2**   | Nice-to-have | Backlog                                              |
| **P3**   | Future   | Future consideration                                     |

---

## Epic 0: View Task List (F0)

The primary screen renders all tasks from local storage. It always stays in sync with the in-memory task array — no page refresh needed. An empty-state prompt guides new users when the list is empty.

---

### US-0.1: View All Tasks on Page Load

**As a** daily checklist keeper (Priya Sharma), **I want to** see my full task list immediately when I open the app, **so that** I can review what I need to do without any extra navigation.

**Acceptance Criteria:**
- [ ] All tasks stored in local storage are displayed in the task list on `DOMContentLoaded`
- [ ] Each task row shows the task title and its completion status (checked/unchecked checkbox)
- [ ] The list renders within 100 ms of page load
- [ ] The list is scrollable when the number of tasks exceeds the visible viewport height
- [ ] Tasks are displayed in the order they were added (array order preserved)

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.2: View Empty State on First Load

**As a** casual jotter (Marcus Webb), **I want to** see a helpful prompt when my task list is empty, **so that** I immediately understand how to get started without needing instructions.

**Acceptance Criteria:**
- [ ] When no tasks exist in local storage, the empty-state message "No tasks yet — add one above!" is displayed
- [ ] The task list container is hidden when the empty state is shown
- [ ] The empty state is shown on first run (no prior local storage data) without errors
- [ ] The empty state disappears immediately when the first task is added
- [ ] If local storage is inaccessible (e.g., private browsing), the empty state is shown silently with no error message to the user

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.3: See Real-Time List Updates

**As a** daily checklist keeper (Priya Sharma), **I want to** see the task list update instantly after any add, complete, or delete action, **so that** I always see an accurate view of my tasks without refreshing the page.

**Acceptance Criteria:**
- [ ] Adding a task causes the new task row to appear in the list within the same event-loop tick (no page refresh required)
- [ ] Marking a task complete immediately updates its visual appearance (strikethrough applied)
- [ ] Deleting a task immediately removes its row from the list
- [ ] If all tasks are deleted, the empty-state message reappears automatically
- [ ] The list render is idempotent — re-rendering with the same task array produces the same DOM state

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.4: See Completed Tasks Visually Distinguished

**As a** daily checklist keeper (Priya Sharma), **I want to** see a clear visual difference between completed and pending tasks, **so that** I can tell at a glance what is done versus what still needs attention.

**Acceptance Criteria:**
- [ ] Completed tasks display a strikethrough (`text-decoration: line-through`) on the task title
- [ ] Incomplete tasks display their title without strikethrough
- [ ] Optionally, completed task titles may also render in a muted/grey colour for additional clarity
- [ ] The visual indicator is applied immediately on toggle — no delay or refresh needed
- [ ] The visual state matches the stored `completed` boolean — never shows wrong state after reload

**Priority:** P0 | **Feature Ref:** F0

---

## Epic 1: Add Task (F1)

A persistent text input and submit action let the user create tasks instantly. Input is validated, the new task is appended to the list, and local storage is updated automatically.

---

### US-1.1: Add a Task via the Add Button

**As a** casual jotter (Marcus Webb), **I want to** type a task title and click "Add Task" to create it, **so that** I can capture what I need to do quickly without any friction.

**Acceptance Criteria:**
- [ ] A text input field is always visible at the top of the interface (no need to navigate to it)
- [ ] The task input field is auto-focused on page load — the user can begin typing immediately without clicking
- [ ] Clicking the "Add Task" button with a non-empty title creates a new task
- [ ] The new task is appended to the bottom of the task list immediately after submission
- [ ] The input field is cleared after a successful submission
- [ ] Focus returns to the input field after submission so the user can type another task immediately
- [ ] The task is saved to local storage as part of the same submission action

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.2: Add a Task via the Enter Key

**As a** daily checklist keeper (Priya Sharma), **I want to** press Enter to submit a task without reaching for the mouse, **so that** I can build my checklist quickly using keyboard only.

**Acceptance Criteria:**
- [ ] Pressing the Enter key while the task input field is focused submits the task
- [ ] Enter key submission behaves identically to clicking the "Add Task" button
- [ ] The input field is cleared and focus is retained after Enter key submission
- [ ] Enter key does not trigger submission when the input is empty or whitespace-only

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.3: Prevent Empty Task Submission

**As a** casual jotter (Marcus Webb), **I want to** be stopped from accidentally submitting a blank task, **so that** my task list stays clean and meaningful.

**Acceptance Criteria:**
- [ ] Submitting an empty or whitespace-only input does not create a task
- [ ] A validation error message "Task title cannot be empty." is displayed below the input field
- [ ] The error message is cleared on the next successful submission
- [ ] The input field remains focused after a failed submission so the user can correct it
- [ ] No changes are made to the task array or local storage on a failed submission

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.4: Handle Storage Error When Adding a Task

**As a** casual jotter (Marcus Webb), **I want to** be informed if my task cannot be saved, **so that** I know to take action rather than assuming the task was stored.

**Acceptance Criteria:**
- [ ] If local storage is full (`QuotaExceededError`), the user sees "Storage full. Delete some tasks to free space."
- [ ] If any other storage write error occurs, the user sees "Could not save task. Please try again."
- [ ] When a storage error occurs, the new task is rolled back from the in-memory list (not shown in the list)
- [ ] The error message is displayed as a dismissible banner or inline message
- [ ] The error banner auto-dismisses after 5 seconds or on the next successful operation

**Priority:** P0 | **Feature Ref:** F1

---

## Epic 2: Mark Task Complete (F2)

Each task row includes a checkbox that toggles the task between complete and incomplete. The change is persisted immediately and the visual indicator updates in real time. The toggle is fully reversible.

---

### US-2.1: Mark a Task as Complete

**As a** daily checklist keeper (Priya Sharma), **I want to** check a task's checkbox to mark it done, **so that** I can track my progress and see what I've accomplished throughout the day.

**Acceptance Criteria:**
- [ ] Every task row has a visible checkbox reflecting the current `completed` state
- [ ] Clicking an unchecked checkbox sets `completed: true` and applies the strikethrough visual indicator immediately
- [ ] The checkbox appears checked after the toggle
- [ ] The updated completion state is saved to local storage within the same event-loop tick as the toggle
- [ ] Only the `completed` field is mutated — `id`, `title`, and `createdAt` remain unchanged

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.2: Un-complete a Completed Task

**As a** daily checklist keeper (Priya Sharma), **I want to** uncheck a completed task, **so that** I can mark it as pending again if I need to revisit it.

**Acceptance Criteria:**
- [ ] Clicking a checked checkbox sets `completed: false` and removes the strikethrough immediately
- [ ] The checkbox appears unchecked after the toggle
- [ ] The reverted completion state is saved to local storage immediately
- [ ] The toggle can be performed any number of times — behaviour is consistent on every toggle

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.3: Completion State Persists Across Page Refresh

**As a** daily checklist keeper (Priya Sharma), **I want to** see my checked and unchecked tasks exactly as I left them after a page refresh, **so that** my work-in-progress list is never lost between browser sessions.

**Acceptance Criteria:**
- [ ] After a page refresh, every task's checkbox reflects the saved `completed` boolean from local storage
- [ ] Tasks that were completed before refresh continue to show strikethrough after reload
- [ ] Tasks that were incomplete before refresh continue to show without strikethrough after reload
- [ ] No task changes its completion state silently between sessions

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.4: Handle Storage Error When Toggling Completion

**As a** daily checklist keeper (Priya Sharma), **I want to** be notified if a completion toggle cannot be saved, **so that** my list doesn't show incorrect state that contradicts what's stored.

**Acceptance Criteria:**
- [ ] If `QuotaExceededError` occurs during toggle, `completed` is reverted to its prior value and the user sees "Storage full. Delete some tasks to free space."
- [ ] If any other storage error occurs during toggle, `completed` is reverted and the user sees "Could not save change. Please try again."
- [ ] The checkbox UI reverts to reflect the prior state (no inconsistency between displayed and stored state)
- [ ] The error message is shown as a dismissible banner that auto-dismisses after 5 seconds

**Priority:** P0 | **Feature Ref:** F2

---

## Epic 3: Delete Task (F3)

Each task row has a delete control that permanently removes the task from the list and local storage in a single click. No confirmation dialog is shown — the interaction is intentionally fast.

---

### US-3.1: Delete a Task with One Click

**As a** casual jotter (Marcus Webb), **I want to** remove a task in a single click with no confirmation dialog, **so that** I can quickly clear completed or irrelevant items without interrupting my flow.

**Acceptance Criteria:**
- [ ] Every task row displays a "Delete" button (or trash icon with `aria-label="Delete task"`)
- [ ] Clicking the delete button removes the task from the list immediately (same event-loop tick)
- [ ] The task is permanently removed from local storage as part of the same action
- [ ] No confirmation dialog is shown before deletion
- [ ] The remaining tasks continue to display correctly after deletion

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.2: Empty State Shown After Last Task Is Deleted

**As a** casual jotter (Marcus Webb), **I want to** see the empty-state message when I delete my last task, **so that** the interface remains clear and guides me to add a new task.

**Acceptance Criteria:**
- [ ] Deleting the last remaining task triggers the empty-state message "No tasks yet — add one above!" immediately
- [ ] The task list container is hidden when the empty state is displayed
- [ ] The empty state is shown without errors and remains functional (user can still add new tasks)

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.3: Handle Storage Error When Deleting a Task

**As a** casual jotter (Marcus Webb), **I want to** be notified if a task deletion cannot be saved, **so that** I don't see the task disappear from view while it still exists in storage.

**Acceptance Criteria:**
- [ ] If `QuotaExceededError` occurs during delete, the task is re-inserted into the list and the user sees "Storage full. Could not save changes."
- [ ] If any other storage error occurs, the task is re-inserted at its original position and the user sees "Could not delete task. Please try again."
- [ ] The list reflects the reverted state (task still present) after a failed delete
- [ ] The error message is shown as a dismissible banner that auto-dismisses after 5 seconds

**Priority:** P0 | **Feature Ref:** F3

---

## Epic 4: Local Storage Persistence (F4)

All task data is automatically saved to and loaded from `window.localStorage` under the key `"todoapp_tasks"`. Persistence is invisible — no manual save action is required. The feature handles all edge cases (first run, corrupt data, quota exceeded) gracefully.

---

### US-4.1: Tasks Are Automatically Saved on Every Change

**As a** daily checklist keeper (Priya Sharma), **I want to** never have to press a "Save" button, **so that** my task list is always up to date without any extra effort on my part.

**Acceptance Criteria:**
- [ ] Every add, complete/uncomplete, and delete action triggers an automatic save to local storage
- [ ] If the browser is closed or the page unloads immediately after any action, the task state is fully preserved on next open — no data loss occurs even if the page unloads mid-render
- [ ] No "Save" button or explicit save action exists in the UI
- [ ] The storage key `"todoapp_tasks"` always holds the current full task array after every operation

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.2: Tasks Are Restored on Page Load

**As a** daily checklist keeper (Priya Sharma), **I want to** find my complete task list exactly as I left it whenever I return to the app, **so that** I can trust TodoApp as my reliable daily checklist across my entire workday.

**Acceptance Criteria:**
- [ ] On `DOMContentLoaded`, the app reads `localStorage["todoapp_tasks"]` before any user interaction
- [ ] The full task array (titles and completion states) is reconstructed and rendered from local storage
- [ ] Tasks survive a browser page refresh with no data loss
- [ ] Tasks survive a full browser restart and re-opening the same tab/URL
- [ ] Data is scoped to the browser origin — tasks are not shared across different origins

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.3: Graceful First-Run Behaviour

**As a** casual jotter (Marcus Webb), **I want to** open the app for the first time and see a clean, working interface — not an error, **so that** I can start adding tasks immediately without any setup.

**Acceptance Criteria:**
- [ ] On first run (no `"todoapp_tasks"` key in local storage), `loadTasks()` returns an empty array `[]`
- [ ] The empty-state message is shown with no errors logged to the user
- [ ] The app is fully functional immediately — the user can add tasks right away
- [ ] After the first task is added, the storage key is created automatically

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.4: Graceful Recovery from Corrupt or Invalid Storage Data

**As a** casual jotter (Marcus Webb), **I want to** still be able to use the app even if my stored data somehow becomes corrupted, **so that** a data issue never leaves me with a broken or unusable app.

**Acceptance Criteria:**
- [ ] If the stored JSON under `"todoapp_tasks"` cannot be parsed, the corrupt key is removed and the app starts fresh with an empty list
- [ ] If the stored value is not a JSON array, it is treated as corrupt and cleared
- [ ] Malformed individual task objects (missing `id`, `title`, or non-boolean `completed`) are silently skipped; valid tasks in the same array still render
- [ ] No error message is shown to the user in any of these corruption scenarios
- [ ] A warning is logged to `console.warn` for developer diagnostics

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.5: Graceful Handling When Local Storage Is Unavailable

**As a** casual jotter (Marcus Webb), **I want to** be able to use the app even in a private/incognito browser where local storage may be restricted, **so that** I can at least use the app for my current session without hitting an error screen.

**Acceptance Criteria:**
- [ ] If `localStorage.getItem` throws (e.g., `SecurityError` in private browsing), the app loads with an empty task list and no user-visible error
- [ ] The app functions as a session-only in-memory list — tasks can be added, completed, and deleted for the current page session
- [ ] No error banner or alert is shown to the user when local storage is inaccessible on load
- [ ] A warning is logged to `console.warn` for developer diagnostics

**Priority:** P0 | **Feature Ref:** F4

---

## Story Index

| Story ID | Title                                            | Persona         | Priority | Feature Ref |
|----------|--------------------------------------------------|-----------------|----------|-------------|
| US-0.1   | View All Tasks on Page Load                      | Priya Sharma    | P0       | F0          |
| US-0.2   | View Empty State on First Load                   | Marcus Webb     | P0       | F0          |
| US-0.3   | See Real-Time List Updates                       | Priya Sharma    | P0       | F0          |
| US-0.4   | See Completed Tasks Visually Distinguished       | Priya Sharma    | P0       | F0          |
| US-1.1   | Add a Task via the Add Button                    | Marcus Webb     | P0       | F1          |
| US-1.2   | Add a Task via the Enter Key                     | Priya Sharma    | P0       | F1          |
| US-1.3   | Prevent Empty Task Submission                    | Marcus Webb     | P0       | F1          |
| US-1.4   | Handle Storage Error When Adding a Task          | Marcus Webb     | P0       | F1          |
| US-2.1   | Mark a Task as Complete                          | Priya Sharma    | P0       | F2          |
| US-2.2   | Un-complete a Completed Task                     | Priya Sharma    | P0       | F2          |
| US-2.3   | Completion State Persists Across Page Refresh    | Priya Sharma    | P0       | F2          |
| US-2.4   | Handle Storage Error When Toggling Completion    | Priya Sharma    | P0       | F2          |
| US-3.1   | Delete a Task with One Click                     | Marcus Webb     | P0       | F3          |
| US-3.2   | Empty State Shown After Last Task Is Deleted     | Marcus Webb     | P0       | F3          |
| US-3.3   | Handle Storage Error When Deleting a Task        | Marcus Webb     | P0       | F3          |
| US-4.1   | Tasks Are Automatically Saved on Every Change    | Priya Sharma    | P0       | F4          |
| US-4.2   | Tasks Are Restored on Page Load                  | Priya Sharma    | P0       | F4          |
| US-4.3   | Graceful First-Run Behaviour                     | Marcus Webb     | P0       | F4          |
| US-4.4   | Graceful Recovery from Corrupt Storage Data      | Marcus Webb     | P0       | F4          |
| US-4.5   | Graceful Handling When Local Storage Unavailable | Marcus Webb     | P0       | F4          |

**Total stories: 20 across 5 epics**

---

*UserStories generated: 2026-05-08 | Model: claude-sonnet-4-6 | Source: PRD-TodoApp.md + FRD-TodoApp.md + PERSONAS-TodoApp.md*
