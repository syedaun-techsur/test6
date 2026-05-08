# Requirements Traceability Matrix — TodoApp

**Project:** Basic To-Do App
**Acronym:** TodoApp
**RTM Version:** 1.0
**PRD Version:** 1.0 | **FRD Version:** 1.0 | **TechArch Version:** 1.0
**Generated:** 2026-05-08
**Status:** Draft

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides bidirectional traceability between all TodoApp v1 specification documents. It ensures that every product feature defined in the PRD is decomposed into functional requirements in the FRD, implemented via an architectural specification in the TechArch, and validated through user stories and test cases. The matrix covers the complete v1 scope: five P0 features (F0–F4) spanning task list display, task creation, task completion, task deletion, and local storage persistence.

Traceability is maintained at four levels. The **PRD level** (F0–F4) defines the five product features and their priorities. The **FRD level** (F00–F04, Y0–Y3) provides the detailed behavioural specification for each feature including sub-features, process flows, validation rules, error states, and the cross-cutting data schema, API interface, error catalog, and browser integration contracts. The **TechArch level** defines the component architecture (TaskStore, TaskActions, Renderer, EventHandlers), the data model, the client-side module interface, security architecture, and the technology stack. The **UserStory level** (US-0.1–US-4.5) captures the 20 acceptance-tested stories — four per feature on average — that define done for each capability.

This document is intended to serve as the single authoritative link between requirements and implementation deliverables, support impact analysis for any future change requests, and provide the test planning team with a complete coverage baseline for v1 acceptance testing.

---

## 2. Requirements Summary

### PRD Features

- **F0 — View Task List** (P0): Display all tasks on load; real-time updates after any mutation; empty-state message; completion visual indicator (strikethrough).
- **F1 — Add Task** (P0): Always-visible text input; submit via button or Enter; whitespace trim and empty-input validation; auto-save on creation; input cleared after submit.
- **F2 — Mark Task Complete** (P0): Per-row checkbox toggle; immediate visual strikethrough; reversible toggle; completion state auto-saved and persisted across refresh.
- **F3 — Delete Task** (P0): Per-row delete button; immediate removal with no confirmation dialog; auto-save on deletion; empty-state shown if list becomes empty.
- **F4 — Local Storage Persistence** (P0): Auto-load on `DOMContentLoaded`; auto-save on every mutation; JSON serialisation/deserialisation; graceful handling of missing key, corrupt data, quota exceeded, and storage unavailability.

### FRD Functional Specifications

- **F00** — View Task List: `renderTaskList()` called on load and after every mutation; empty-state / task-row rendering logic; error codes `STORAGE_READ_FAILED`, `TASK_SCHEMA_INVALID`, `DOM_CONTAINER_MISSING`.
- **F01** — Add Task: `addTask(title)` validation flow; UUID generation; `tasks.push` → `saveTasks` → `renderTaskList` sequence; error codes `TASK_TITLE_EMPTY`, `STORAGE_QUOTA_EXCEEDED`, `STORAGE_WRITE_FAILED`, `TASK_ID_COLLISION`.
- **F02** — Mark Task Complete: `toggleTask(taskId)` flip logic; `data-task-id` binding; revert on storage error; error codes `TASK_NOT_FOUND`, `STORAGE_QUOTA_EXCEEDED`, `STORAGE_WRITE_FAILED`.
- **F03** — Delete Task: `deleteTask(taskId)` splice logic; no confirmation; revert on storage error; error codes `TASK_NOT_FOUND`, `STORAGE_QUOTA_EXCEEDED`, `STORAGE_WRITE_FAILED`.
- **F04** — Local Storage Persistence: `loadTasks()` / `saveTasks()` / `isValidTask()` contracts; error codes `STORAGE_READ_FAILED`, `STORAGE_CORRUPT`, `STORAGE_QUOTA_EXCEEDED`, `STORAGE_WRITE_FAILED`.
- **Y0** — Data Schema: `Task` object (`id`, `title`, `completed`, `createdAt`); storage key `"todoapp_tasks"`; five invariants.
- **Y1** — Client-Side Module Interface: `TaskStore` (`loadTasks`, `saveTasks`, `isValidTask`); `TaskActions` (`addTask`, `toggleTask`, `deleteTask`); `Renderer` (`renderTaskList`); `ValidationError` and `StorageError` types.
- **Y2** — Error Catalog: Nine error codes (`TASK_TITLE_EMPTY`, `TASK_NOT_FOUND`, `TASK_ID_COLLISION`, `TASK_SCHEMA_INVALID`, `STORAGE_READ_FAILED`, `STORAGE_CORRUPT`, `STORAGE_QUOTA_EXCEEDED`, `STORAGE_WRITE_FAILED`, `DOM_CONTAINER_MISSING`).
- **Y3** — Browser Integration: `window.localStorage`, DOM Events (`DOMContentLoaded`, `click`, `change`, `keydown`), `crypto.randomUUID()`, `JSON`.

### TechArch Specifications

- **SPEC-TS-001** — Single-tier client-side architecture; no backend, no network calls, static file deployment.
- **SPEC-TS-002** — TaskStore component: `loadTasks`, `saveTasks`, `isValidTask`; owns `"todoapp_tasks"` localStorage key.
- **SPEC-TS-003** — TaskActions component: `addTask`, `toggleTask`, `deleteTask`; validate → mutate → save → render sequence.
- **SPEC-TS-004** — Renderer component: `renderTaskList`; full idempotent re-render; event listener rebinding.
- **SPEC-TS-005** — EventHandlers component: `DOMContentLoaded` bootstrap; Add Form event binding.
- **SPEC-TS-006** — Task data model: `{ id, title, completed, createdAt }`; five schema invariants; `isValidTask` predicate.
- **SPEC-TS-007** — Client-side module interface: full function signatures, contracts, error types, UI element reference.
- **SPEC-TS-008** — Security architecture: XSS mitigation via `textContent`; input validation; localStorage origin isolation; recommended CSP header.
- **SPEC-TS-009** — Technology stack: HTML5, CSS3, ES2022/TypeScript, localStorage, Vite, Vitest; performance budget.
- **SPEC-TS-010** — Browser API integration: localStorage, DOM Events, Web Crypto, JSON; compatibility matrix (Chrome/Firefox/Safari/Edge).

### Non-Functional Requirements

- **Performance:** Task list render < 100 ms; CRUD interactions < 50 ms UI response.
- **Reliability:** No data loss on page refresh; synchronous localStorage writes confirmed before DOM update.
- **Usability:** New user can add, complete, and delete a task within 30 seconds.
- **Accessibility:** All interactive elements keyboard-navigable with ARIA labels.
- **Compatibility:** Two latest stable versions of Chrome, Firefox, Safari, and Edge.
- **Responsiveness:** Usable on screen widths ≥ 320 px; no horizontal scroll.
- **Deployability:** Static bundle; deployable to any CDN or file host.

---

## 3. Traceability Matrix

### 3.1 Core Feature Traceability: PRD → FRD → TechArch → User Stories

| PRD Feature | FRD Section | FRD Functions | TechArch Spec | User Stories |
|---|---|---|---|---|
| F0: View Task List | F00 | `loadTasks()`, `renderTaskList()` | SPEC-TS-002, SPEC-TS-004, SPEC-TS-005 | US-0.1, US-0.2, US-0.3, US-0.4 |
| F1: Add Task | F01 | `addTask()`, `saveTasks()`, `renderTaskList()` | SPEC-TS-003, SPEC-TS-002, SPEC-TS-004 | US-1.1, US-1.2, US-1.3, US-1.4 |
| F2: Mark Task Complete | F02 | `toggleTask()`, `saveTasks()`, `renderTaskList()` | SPEC-TS-003, SPEC-TS-002, SPEC-TS-004 | US-2.1, US-2.2, US-2.3, US-2.4 |
| F3: Delete Task | F03 | `deleteTask()`, `saveTasks()`, `renderTaskList()` | SPEC-TS-003, SPEC-TS-002, SPEC-TS-004 | US-3.1, US-3.2, US-3.3 |
| F4: Local Storage Persistence | F04, Y0, Y1, Y3 | `loadTasks()`, `saveTasks()`, `isValidTask()` | SPEC-TS-002, SPEC-TS-006, SPEC-TS-010 | US-4.1, US-4.2, US-4.3, US-4.4, US-4.5 |

### 3.2 Cross-Cutting Specification Traceability

| FRD Section | Description | TechArch Spec | Applicable PRD Features |
|---|---|---|---|
| Y0 — Data Schema | `Task` object; `"todoapp_tasks"` key; 5 invariants | SPEC-TS-006 | F0, F1, F2, F3, F4 |
| Y1 — Module Interface | `TaskStore`, `TaskActions`, `Renderer` function contracts | SPEC-TS-002, SPEC-TS-003, SPEC-TS-004, SPEC-TS-007 | F0, F1, F2, F3, F4 |
| Y2 — Error Catalog | 9 error codes; inline/banner display patterns | SPEC-TS-007, SPEC-TS-008 | F0, F1, F2, F3, F4 |
| Y3 — Browser Integration | `localStorage`, DOM Events, Web Crypto, JSON | SPEC-TS-010 | F0, F1, F2, F3, F4 |

### 3.3 Non-Functional Requirements Traceability

| NFR Category | PRD Requirement | TechArch Spec | Relevant User Stories |
|---|---|---|---|
| Performance | Render < 100 ms; CRUD < 50 ms | SPEC-TS-009 (Performance Budget) | US-0.1 (100 ms render), US-1.1, US-2.1, US-3.1 |
| Reliability | No data loss on refresh; synchronous save before DOM update | SPEC-TS-002, SPEC-TS-003 | US-4.1, US-4.2, US-2.3 |
| Accessibility | Keyboard navigation; ARIA labels | SPEC-TS-007 (UI Element Reference) | US-0.1, US-1.1, US-1.2, US-2.1, US-3.1 |
| Compatibility | Chrome/Firefox/Safari/Edge (latest − 1) | SPEC-TS-010 (Compatibility Matrix) | All US-* |
| Security | XSS via `textContent`; input validation; CSP | SPEC-TS-008 | US-1.3, US-4.4 |
| Deployability | Static bundle; no server | SPEC-TS-001 | — |

---

## 4. Requirements Detail

### F0: View Task List

**PRD Reference:** F0 | **FRD Reference:** F00 | **Priority:** P0

- **Sub-requirement F0.1** — Display all tasks from local storage on `DOMContentLoaded`
  - FRD: F00 §Process steps 1–4; calls `loadTasks()` then `renderTaskList(tasks)`
  - TechArch: SPEC-TS-004 (`renderTaskList`), SPEC-TS-005 (EventHandlers bootstrap)
  - User Stories: US-0.1, US-0.2

- **Sub-requirement F0.2** — Render each task's title and completion state (checkbox + optional strikethrough)
  - FRD: F00 §Process step 5; `<li>` with checkbox, title span, delete button
  - TechArch: SPEC-TS-004 (`renderTaskList` HTML output spec, `.task-title.completed`)
  - User Stories: US-0.1, US-0.4

- **Sub-requirement F0.3** — Show empty-state message `"No tasks yet — add one above!"` when list is empty
  - FRD: F00 §Process step 4a; `#empty-state` element shown, `#task-list` hidden
  - TechArch: SPEC-TS-004 (`renderTaskList` empty-state branch)
  - User Stories: US-0.2, US-3.2

- **Sub-requirement F0.4** — Re-render list immediately after any add, complete/uncomplete, or delete action
  - FRD: F00 §Process step 7; every mutating function calls `renderTaskList` synchronously
  - TechArch: SPEC-TS-003 (mutation sequence), SPEC-TS-004 (idempotent render)
  - User Stories: US-0.3

- **Error Handling** — `STORAGE_READ_FAILED` (silent fallback `[]`), `TASK_SCHEMA_INVALID` (skip malformed items), `DOM_CONTAINER_MISSING` (`console.error`, no render)
  - FRD: F00 §Error States; Y2 §Error Code Reference
  - TechArch: SPEC-TS-007 (Error Code Reference), SPEC-TS-008

---

### F1: Add Task

**PRD Reference:** F1 | **FRD Reference:** F01 | **Priority:** P0

- **Sub-requirement F1.1** — Always-visible text input (`#task-input`) with auto-focus on page load
  - FRD: F01 §Process step 1; `inputElement.focus()` on `DOMContentLoaded`
  - TechArch: SPEC-TS-005 (EventHandlers), SPEC-TS-007 (`#task-input` element reference)
  - User Stories: US-1.1, US-1.2

- **Sub-requirement F1.2** — Submit via `#add-task-btn` click or Enter keydown
  - FRD: F01 §Process step 3; `click` on `#add-task-btn`; `keydown` with `event.key === "Enter"`
  - TechArch: SPEC-TS-005 (EventHandlers), SPEC-TS-010 (DOM Events)
  - User Stories: US-1.1, US-1.2

- **Sub-requirement F1.3** — Trim input; reject empty submissions with `"Task title cannot be empty."` validation message
  - FRD: F01 §Process steps 4–5; `TASK_TITLE_EMPTY` error code
  - TechArch: SPEC-TS-003 (`addTask` behaviour), SPEC-TS-008 (Input Validation)
  - User Stories: US-1.3

- **Sub-requirement F1.4** — Append new task to `tasks[]`; persist via `saveTasks()`; re-render via `renderTaskList()`; clear input
  - FRD: F01 §Process step 6a–h; `addTask` sequence
  - TechArch: SPEC-TS-003 (`addTask` happy path), SPEC-TS-002 (`saveTasks`)
  - User Stories: US-1.1, US-1.2

- **Sub-requirement F1.5** — Generate unique `id` via `crypto.randomUUID()` with collision retry (up to 5×)
  - FRD: F01 §Validation; Y2 `TASK_ID_COLLISION`
  - TechArch: SPEC-TS-010 (Web Crypto), SPEC-TS-007 (`addTask` behaviour step 3)
  - User Stories: US-1.1

- **Error Handling** — `TASK_TITLE_EMPTY` (inline validation message), `STORAGE_QUOTA_EXCEEDED` (rollback + banner), `STORAGE_WRITE_FAILED` (rollback + banner `"Could not save task."`)
  - FRD: F01 §Error States; Y2 detailed error handling
  - TechArch: SPEC-TS-007 (Error Code Reference)
  - User Stories: US-1.3, US-1.4

---

### F2: Mark Task Complete

**PRD Reference:** F2 | **FRD Reference:** F02 | **Priority:** P0

- **Sub-requirement F2.1** — Per-row `<input type="checkbox" data-task-id="{id}">` reflects `task.completed`
  - FRD: F02 §Process steps 1–2; checkbox `checked` attribute tied to `task.completed`
  - TechArch: SPEC-TS-004 (`renderTaskList` HTML spec), SPEC-TS-007 (`[data-task-id]`)
  - User Stories: US-2.1, US-2.2

- **Sub-requirement F2.2** — Checkbox `change` event calls `toggleTask(taskId)`; flips `completed` boolean
  - FRD: F02 §Process steps 3–7; `T.completed = !T.completed`
  - TechArch: SPEC-TS-003 (`toggleTask` behaviour), SPEC-TS-004 (listener rebinding)
  - User Stories: US-2.1, US-2.2

- **Sub-requirement F2.3** — Visual strikethrough applied/removed immediately via `.task-title.completed` CSS class
  - FRD: F02 §Outputs; `text-decoration: line-through`
  - TechArch: SPEC-TS-004 (`renderTaskList` span class logic), SPEC-TS-009 (styles/app.css)
  - User Stories: US-0.4, US-2.1, US-2.2

- **Sub-requirement F2.4** — Completion state auto-saved and survives page refresh
  - FRD: F02 §Process step 8; `saveTasks(tasks)` called after every toggle
  - TechArch: SPEC-TS-002 (`saveTasks`), SPEC-TS-006 (schema `completed` field)
  - User Stories: US-2.3, US-4.1

- **Error Handling** — `TASK_NOT_FOUND` (silent DOM resync), `STORAGE_QUOTA_EXCEEDED` (revert + banner), `STORAGE_WRITE_FAILED` (revert + `"Could not save change."`)
  - FRD: F02 §Error States; Y2 detailed error handling
  - TechArch: SPEC-TS-007 (Error Code Reference)
  - User Stories: US-2.4

---

### F3: Delete Task

**PRD Reference:** F3 | **FRD Reference:** F03 | **Priority:** P0

- **Sub-requirement F3.1** — Per-row `<button data-task-id="{id}" aria-label="Delete task">Delete</button>` in every Task Row
  - FRD: F03 §Process step 1; delete control always present
  - TechArch: SPEC-TS-004 (`renderTaskList` HTML spec), SPEC-TS-007 (`[data-task-id]`)
  - User Stories: US-3.1

- **Sub-requirement F3.2** — Single click calls `deleteTask(taskId)`; removes task from `tasks[]` via `filter` or `splice`; no confirmation dialog
  - FRD: F03 §Process steps 2–6; no dialog in v1
  - TechArch: SPEC-TS-003 (`deleteTask` behaviour), SPEC-TS-004 (listener rebinding)
  - User Stories: US-3.1

- **Sub-requirement F3.3** — Persist updated (shorter) array via `saveTasks()`; re-render via `renderTaskList()`
  - FRD: F03 §Process steps 7–8; `saveTasks` called before `renderTaskList`
  - TechArch: SPEC-TS-002 (`saveTasks`), SPEC-TS-003 (mutation sequence)
  - User Stories: US-3.1, US-4.1

- **Sub-requirement F3.4** — If last task deleted, empty-state message shown immediately
  - FRD: F03 §Process step 8a; `tasks.length === 0` triggers empty-state
  - TechArch: SPEC-TS-004 (`renderTaskList` empty-state branch)
  - User Stories: US-3.2

- **Error Handling** — `TASK_NOT_FOUND` (silent DOM resync), `STORAGE_QUOTA_EXCEEDED` (revert re-insert + banner), `STORAGE_WRITE_FAILED` (revert + `"Could not delete task."`)
  - FRD: F03 §Error States; Y2 detailed error handling
  - TechArch: SPEC-TS-007 (Error Code Reference)
  - User Stories: US-3.3

---

### F4: Local Storage Persistence

**PRD Reference:** F4 | **FRD Reference:** F04, Y0, Y1, Y3 | **Priority:** P0

- **Sub-requirement F4.1** — `loadTasks()` called on `DOMContentLoaded`; reads `localStorage["todoapp_tasks"]`; returns `Task[]` (never `null`)
  - FRD: F04 §Process — `loadTasks()` steps 1–4e
  - TechArch: SPEC-TS-002 (`loadTasks` contract), SPEC-TS-010 (`window.localStorage`)
  - User Stories: US-4.2, US-4.3

- **Sub-requirement F4.2** — `saveTasks(tasks)` called after every mutation; serialises via `JSON.stringify`; writes to `localStorage["todoapp_tasks"]`
  - FRD: F04 §Process — `saveTasks()` steps 1–5
  - TechArch: SPEC-TS-002 (`saveTasks` contract), SPEC-TS-010 (JSON)
  - User Stories: US-4.1

- **Sub-requirement F4.3** — `isValidTask(item)` predicate filters malformed items during deserialisation
  - FRD: F04 §Validation — `isValidTask` predicate; Y1 §TaskStore
  - TechArch: SPEC-TS-002 (`isValidTask`), SPEC-TS-006 (schema validation)
  - User Stories: US-4.4

- **Sub-requirement F4.4** — Graceful fallback on missing key (first run → `[]`), corrupt JSON (`removeItem` + `[]`), `SecurityError` on read (`[]` + `console.warn`)
  - FRD: F04 §Process — `loadTasks()` steps 2–4b; Y2 `STORAGE_READ_FAILED`, `STORAGE_CORRUPT`
  - TechArch: SPEC-TS-002 (`loadTasks` behaviour), SPEC-TS-008 (Storage Error Resilience)
  - User Stories: US-4.3, US-4.4, US-4.5

- **Sub-requirement F4.5** — `QuotaExceededError` on save throws `STORAGE_QUOTA_EXCEEDED`; caller reverts mutation; user alerted
  - FRD: F04 §Process — `saveTasks()` step 3; Y2 `STORAGE_QUOTA_EXCEEDED`
  - TechArch: SPEC-TS-002 (`saveTasks` throws), SPEC-TS-008
  - User Stories: US-1.4, US-2.4, US-3.3

---

## 5. Test Case Coverage Matrix

The test cases below are derived directly from the acceptance criteria in the UserStories document. Each TEST ID maps to one or more acceptance criteria within its parent user story.

### 5.1 F0: View Task List

| Test ID | Test Description | User Story | Acceptance Criteria Covered | Test Type |
|---|---|---|---|---|
| TEST-0.1.1 | Tasks load from localStorage on DOMContentLoaded | US-0.1 | All tasks displayed on load; array order preserved | Integration |
| TEST-0.1.2 | Each task row shows title and checkbox state | US-0.1 | Task row shows title + completion status | Unit |
| TEST-0.1.3 | Task list renders within 100 ms | US-0.1 | List renders < 100 ms | Performance |
| TEST-0.1.4 | Task list is scrollable with many tasks | US-0.1 | Scrollable when tasks exceed viewport | UI/Manual |
| TEST-0.2.1 | Empty-state message shown when no tasks exist | US-0.2 | `"No tasks yet — add one above!"` displayed | Unit |
| TEST-0.2.2 | Task list container hidden in empty state | US-0.2 | `#task-list` hidden; `#empty-state` visible | Unit |
| TEST-0.2.3 | Empty state on first run (no localStorage key) | US-0.2 | First-run renders empty state without errors | Integration |
| TEST-0.2.4 | Empty state disappears on first task add | US-0.2 | Empty state hidden after first task added | Integration |
| TEST-0.2.5 | Silent empty state when localStorage inaccessible | US-0.2 | No error shown; empty state rendered | Integration |
| TEST-0.3.1 | New task row appears in same event-loop tick | US-0.3 | DOM updated synchronously after add | Unit |
| TEST-0.3.2 | Strikethrough applied immediately on complete | US-0.3 | Visual update in same tick as toggle | Unit |
| TEST-0.3.3 | Task row removed immediately on delete | US-0.3 | Row absent from DOM after delete | Unit |
| TEST-0.3.4 | Empty state reappears after last task deleted | US-0.3 | Empty state shown when all tasks deleted | Integration |
| TEST-0.3.5 | renderTaskList is idempotent | US-0.3 | Same input → same DOM output | Unit |
| TEST-0.4.1 | Completed task has `text-decoration: line-through` | US-0.4 | Strikethrough CSS applied to completed title | Unit |
| TEST-0.4.2 | Incomplete task has no strikethrough | US-0.4 | No strikethrough on pending task title | Unit |
| TEST-0.4.3 | Visual state matches stored `completed` boolean after reload | US-0.4 | Reload reflects correct visual state | Integration |

### 5.2 F1: Add Task

| Test ID | Test Description | User Story | Acceptance Criteria Covered | Test Type |
|---|---|---|---|---|
| TEST-1.1.1 | Text input visible at top of interface on load | US-1.1 | `#task-input` always visible | UI/Manual |
| TEST-1.1.2 | Input auto-focused on page load | US-1.1 | `document.activeElement === #task-input` | Unit |
| TEST-1.1.3 | Click "Add Task" button creates new task | US-1.1 | Task appended to list after button click | Integration |
| TEST-1.1.4 | New task appears at bottom of list | US-1.1 | Task appended in array order | Unit |
| TEST-1.1.5 | Input field cleared after successful submit | US-1.1 | `#task-input.value === ""` after submit | Unit |
| TEST-1.1.6 | Focus returns to input after successful submit | US-1.1 | `activeElement` is `#task-input` after submit | Unit |
| TEST-1.1.7 | Task saved to localStorage on creation | US-1.1 | `localStorage["todoapp_tasks"]` updated | Integration |
| TEST-1.2.1 | Enter key submits task when input focused | US-1.2 | Enter triggers same flow as button click | Unit |
| TEST-1.2.2 | Enter key behaves identically to button click | US-1.2 | Task created; input cleared; focus returned | Unit |
| TEST-1.2.3 | Enter key does not submit empty input | US-1.2 | No task created on Enter with empty input | Unit |
| TEST-1.3.1 | Empty input does not create task | US-1.3 | `tasks[]` unchanged after empty submit | Unit |
| TEST-1.3.2 | Whitespace-only input does not create task | US-1.3 | Trimmed title `""` rejected | Unit |
| TEST-1.3.3 | Validation message `"Task title cannot be empty."` shown | US-1.3 | Inline error message visible below input | Unit |
| TEST-1.3.4 | Error message cleared on next successful submit | US-1.3 | Validation message absent after valid submit | Unit |
| TEST-1.3.5 | Input remains focused after failed submit | US-1.3 | `activeElement === #task-input` after error | Unit |
| TEST-1.3.6 | localStorage unchanged on failed submit | US-1.3 | Storage not written on validation failure | Unit |
| TEST-1.4.1 | QuotaExceededError shows storage-full banner | US-1.4 | Banner `"Storage full. Delete some tasks to free space."` | Integration |
| TEST-1.4.2 | Write error shows `"Could not save task. Please try again."` | US-1.4 | Correct error banner shown on write failure | Integration |
| TEST-1.4.3 | Task rolled back from in-memory list on storage error | US-1.4 | Task absent from `tasks[]` and DOM after error | Integration |
| TEST-1.4.4 | Error banner auto-dismisses after 5 seconds | US-1.4 | Banner gone after 5 s or next success | Integration |

### 5.3 F2: Mark Task Complete

| Test ID | Test Description | User Story | Acceptance Criteria Covered | Test Type |
|---|---|---|---|---|
| TEST-2.1.1 | Every task row has a checkbox | US-2.1 | Checkbox present in every `<li>` | Unit |
| TEST-2.1.2 | Clicking unchecked checkbox sets `completed: true` | US-2.1 | `task.completed === true` after toggle | Unit |
| TEST-2.1.3 | Strikethrough applied immediately on mark-complete | US-2.1 | `.task-title.completed` present after toggle | Unit |
| TEST-2.1.4 | Checkbox appears checked after toggle | US-2.1 | `checkbox.checked === true` after toggle | Unit |
| TEST-2.1.5 | Completion state saved to localStorage in same tick | US-2.1 | `saveTasks` called before `renderTaskList` | Unit |
| TEST-2.1.6 | Only `completed` field mutated; other fields unchanged | US-2.1 | `id`, `title`, `createdAt` unchanged after toggle | Unit |
| TEST-2.2.1 | Clicking checked checkbox sets `completed: false` | US-2.2 | `task.completed === false` after un-toggle | Unit |
| TEST-2.2.2 | Strikethrough removed on un-complete | US-2.2 | `.task-title.completed` absent after un-toggle | Unit |
| TEST-2.2.3 | Un-complete saves to localStorage immediately | US-2.2 | `localStorage["todoapp_tasks"]` reflects false | Integration |
| TEST-2.2.4 | Toggle reversible any number of times | US-2.2 | Consistent behaviour on repeated toggles | Unit |
| TEST-2.3.1 | Completion state persists after page refresh | US-2.3 | Post-reload checkboxes match stored state | Integration |
| TEST-2.3.2 | Completed tasks show strikethrough after reload | US-2.3 | Strikethrough present after reload | Integration |
| TEST-2.3.3 | No task silently changes state between sessions | US-2.3 | No unintended state mutation on load | Integration |
| TEST-2.4.1 | QuotaExceededError reverts toggle and shows banner | US-2.4 | `completed` reverted; banner shown | Integration |
| TEST-2.4.2 | Write error reverts toggle and shows `"Could not save change."` | US-2.4 | Correct message; state reverted | Integration |
| TEST-2.4.3 | Checkbox UI reverts to prior state on error | US-2.4 | Checkbox reflects reverted value | Integration |

### 5.4 F3: Delete Task

| Test ID | Test Description | User Story | Acceptance Criteria Covered | Test Type |
|---|---|---|---|---|
| TEST-3.1.1 | Every task row has a Delete button with aria-label | US-3.1 | `<button aria-label="Delete task">` in every row | Unit |
| TEST-3.1.2 | Single click removes task from list immediately | US-3.1 | Task row absent from DOM after click | Unit |
| TEST-3.1.3 | Task removed from localStorage on delete | US-3.1 | `localStorage["todoapp_tasks"]` no longer contains task | Integration |
| TEST-3.1.4 | No confirmation dialog shown | US-3.1 | No `window.confirm` or dialog element | Unit |
| TEST-3.1.5 | Remaining tasks still render correctly after delete | US-3.1 | Other task rows unaffected | Integration |
| TEST-3.2.1 | Empty-state shown after last task deleted | US-3.2 | `"No tasks yet — add one above!"` appears | Integration |
| TEST-3.2.2 | Task list container hidden after last task deleted | US-3.2 | `#task-list` hidden; `#empty-state` visible | Unit |
| TEST-3.2.3 | App remains functional after empty state via delete | US-3.2 | New task can be added after deletion empties list | Integration |
| TEST-3.3.1 | QuotaExceededError re-inserts task and shows banner | US-3.3 | Task back in list; banner shown | Integration |
| TEST-3.3.2 | Write error re-inserts task at original position | US-3.3 | Task at same index; `"Could not delete task."` banner | Integration |
| TEST-3.3.3 | List reflects reverted state after failed delete | US-3.3 | DOM and `tasks[]` in sync after revert | Integration |

### 5.5 F4: Local Storage Persistence

| Test ID | Test Description | User Story | Acceptance Criteria Covered | Test Type |
|---|---|---|---|---|
| TEST-4.1.1 | Every add action writes to localStorage | US-4.1 | `localStorage` updated after `addTask` | Unit |
| TEST-4.1.2 | Every toggle writes to localStorage | US-4.1 | `localStorage` updated after `toggleTask` | Unit |
| TEST-4.1.3 | Every delete writes to localStorage | US-4.1 | `localStorage` updated after `deleteTask` | Unit |
| TEST-4.1.4 | No "Save" button exists in UI | US-4.1 | No explicit save control in DOM | UI/Manual |
| TEST-4.1.5 | `"todoapp_tasks"` key holds full current array after every op | US-4.1 | Key value matches `tasks[]` after each action | Unit |
| TEST-4.2.1 | `loadTasks()` reads localStorage on DOMContentLoaded | US-4.2 | `localStorage.getItem` called before render | Unit |
| TEST-4.2.2 | Full task array (titles + completion) restored from storage | US-4.2 | All tasks rendered with correct state on load | Integration |
| TEST-4.2.3 | Tasks survive page refresh with no data loss | US-4.2 | Task array identical before and after refresh | Integration |
| TEST-4.2.4 | Tasks survive browser restart | US-4.2 | Tasks present after browser close/reopen | Manual |
| TEST-4.2.5 | Data scoped to browser origin | US-4.2 | Tasks not shared across different origins | Manual |
| TEST-4.3.1 | Missing key on first run returns `[]` | US-4.3 | `loadTasks()` returns `[]` when key absent | Unit |
| TEST-4.3.2 | Empty state shown on first run, no errors | US-4.3 | Empty state shown; no `console.error` | Unit |
| TEST-4.3.3 | App fully functional on first run | US-4.3 | Tasks can be added immediately | Integration |
| TEST-4.3.4 | Storage key created after first task added | US-4.3 | `"todoapp_tasks"` key exists after first `addTask` | Unit |
| TEST-4.4.1 | Corrupt JSON clears key and returns `[]` | US-4.4 | `localStorage.removeItem` called; `[]` returned | Unit |
| TEST-4.4.2 | Non-array value treated as corrupt | US-4.4 | Non-array cleared; `[]` returned | Unit |
| TEST-4.4.3 | Malformed task objects skipped; valid tasks still render | US-4.4 | Valid tasks render; malformed items absent | Unit |
| TEST-4.4.4 | No error message shown to user on corruption | US-4.4 | No banner/message to user; `console.warn` logged | Unit |
| TEST-4.5.1 | `SecurityError` on getItem returns `[]` silently | US-4.5 | No error shown; empty list rendered | Unit |
| TEST-4.5.2 | App functional as session-only list when storage unavailable | US-4.5 | Add/complete/delete work for current session | Integration |
| TEST-4.5.3 | No error banner on storage-unavailable page load | US-4.5 | No user-visible error on incognito load | Integration |

### 5.6 Coverage Summary

| PRD Feature | User Stories | Test Cases | Story Coverage | Test Coverage |
|---|---|---|---|---|
| F0: View Task List | US-0.1, US-0.2, US-0.3, US-0.4 | TEST-0.1.1 → TEST-0.4.3 (17 tests) | 4 / 4 | 100% |
| F1: Add Task | US-1.1, US-1.2, US-1.3, US-1.4 | TEST-1.1.1 → TEST-1.4.4 (20 tests) | 4 / 4 | 100% |
| F2: Mark Task Complete | US-2.1, US-2.2, US-2.3, US-2.4 | TEST-2.1.1 → TEST-2.4.3 (16 tests) | 4 / 4 | 100% |
| F3: Delete Task | US-3.1, US-3.2, US-3.3 | TEST-3.1.1 → TEST-3.3.3 (11 tests) | 3 / 3 | 100% |
| F4: Local Storage Persistence | US-4.1, US-4.2, US-4.3, US-4.4, US-4.5 | TEST-4.1.1 → TEST-4.5.3 (23 tests) | 5 / 5 | 100% |
| **Total** | **20 stories** | **87 test cases** | **20 / 20** | **100%** |

### 5.7 Test Type Distribution

| Test Type | Count | Notes |
|---|---|---|
| Unit | 53 | Pure function tests for `addTask`, `toggleTask`, `deleteTask`, `loadTasks`, `saveTasks`, `isValidTask`, `renderTaskList` — runnable with Vitest |
| Integration | 28 | Full flow tests: localStorage read/write + DOM render; runnable with Vitest + jsdom |
| Performance | 1 | TEST-0.1.3: render < 100 ms; automated in CI |
| UI / Manual | 5 | Visual/layout checks; browser smoke test |
| **Total** | **87** | |

---

## 6. Change Management

### 6.1 Change Log

| Change ID | Date | Description | Affected Documents | Impact | Status |
|---|---|---|---|---|---|
| CHG-001 | 2026-05-08 | Initial RTM creation from PRD v1.0, FRD v1.0, TechArch v1.0, UserStories v1.0 | All | Baseline established | Approved |

### 6.2 Change Impact Assessment Process

When a change request is received, the following traceability chain must be assessed:

1. **Identify the initiating document** — PRD feature change, FRD requirement change, TechArch spec change, or UserStory acceptance criteria change.
2. **Trace downstream** — use Section 3 to identify all downstream documents affected (e.g., a PRD feature change propagates to FRD, TechArch, UserStories, and test cases).
3. **Trace upstream** — confirm the change does not contradict any upstream constraint (e.g., a new FRD requirement must map to a PRD feature or be flagged as out-of-scope).
4. **Update RTM** — add a CHG-XXX entry to this log; update all affected rows in Section 3 and Section 5.
5. **Obtain approval** — all RTM updates require sign-off per Section 7 before implementation.

### 6.3 Out-of-Scope Items (Deferred to Future Versions)

The following items were explicitly excluded from v1 and must not be added without a formal change request:

| Item | Deferred Version | PRD Reference |
|---|---|---|
| User accounts / authentication | v2+ | PRD §9 Out of Scope |
| Task categories / tags | v2+ | PRD §9 Out of Scope |
| Due dates / reminders | v2+ | PRD §9 Out of Scope |
| Collaboration / sharing | v2+ | PRD §9 Out of Scope |
| Undo / redo | v2+ | PRD §9 Out of Scope |
| Cloud sync (Firebase, Supabase) | v2+ | TechArch §7.3 |
| Service Worker / PWA | v2+ | TechArch §7.3 |
| Analytics / error monitoring | v2+ | TechArch §7.3 |

---

## 7. Approval

### 7.1 Document Sign-Off

| Role | Name | Signature | Date | Status |
|---|---|---|---|---|
| Product Owner | — | | | Pending |
| Engineering Lead | — | | | Pending |
| QA Lead | — | | | Pending |
| Design Lead | — | | | Pending |

### 7.2 Approval Criteria

This RTM is considered approved when:

- [ ] All PRD features (F0–F4) have complete traceability to FRD, TechArch, and UserStories
- [ ] All 20 user stories are mapped to at least one test case
- [ ] All 87 test cases are assigned a test type and owner
- [ ] All out-of-scope items are confirmed deferred
- [ ] All four signing roles have provided written sign-off

### 7.3 Review Cadence

| Review Type | Trigger | Owner |
|---|---|---|
| Initial review | RTM first draft | Product Owner + Engineering Lead |
| Impact review | Any CHG-XXX change request | Engineering Lead + QA Lead |
| Pre-release review | Before v1 release cut | All signing roles |
| Post-release retrospective | After v1 ship | Product Owner |

---

*RTM generated: 2026-05-08 | Model: claude-sonnet-4-6 | Sources: PRD-TodoApp.md + FRD-TodoApp.md + TechArch-TodoApp.md + UserStories-TodoApp.md*
