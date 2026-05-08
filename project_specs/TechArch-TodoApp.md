# Technical Architecture Document — TodoApp

**Project:** Basic To-Do App
**Acronym:** TodoApp
**TechArch Version:** 1.0
**PRD Version:** 1.0
**FRD Version:** 1.0
**Generated:** 2026-05-08
**Status:** Draft

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Component Architecture](#2-component-architecture)
3. [Data Model](#3-data-model)
4. [API Design — Client-Side Module Interface](#4-api-design--client-side-module-interface)
5. [Security Architecture](#5-security-architecture)
6. [Technology Stack](#6-technology-stack)
7. [Integration Points](#7-integration-points)

---

## 1. Architectural Overview

### 1.1 Architecture Pattern

TodoApp v1 is a **single-page, frontend-only static web application**. There is no server, no network API, and no backend service. The entire application runs in the browser as a self-contained JavaScript module. All state lives in memory during the page session and is persisted to `window.localStorage` as a JSON string.

This maps to a **Single-Tier Client-Side Architecture** (also called a "zero-tier" or "local-first" app):

- No backend tier
- No network calls at runtime
- No build server required (can be served as raw static files)
- Persistence layer: browser `localStorage` (same-origin, same-device)

### 1.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    TodoApp SPA                          │   │
│  │                                                         │   │
│  │  ┌──────────────┐      ┌──────────────────────────┐    │   │
│  │  │   UI Layer   │      │     State / Logic Layer  │    │   │
│  │  │              │      │                          │    │   │
│  │  │  ┌─────────┐ │      │  ┌────────────────────┐ │    │   │
│  │  │  │ Add Form│ │◄────►│  │   TaskActions      │ │    │   │
│  │  │  └─────────┘ │      │  │  addTask()         │ │    │   │
│  │  │              │      │  │  toggleTask()      │ │    │   │
│  │  │  ┌─────────┐ │      │  │  deleteTask()      │ │    │   │
│  │  │  │TaskList │ │◄────►│  └────────────────────┘ │    │   │
│  │  │  └─────────┘ │      │                          │    │   │
│  │  │              │      │  ┌────────────────────┐  │    │   │
│  │  │  ┌─────────┐ │      │  │   TaskStore        │  │    │   │
│  │  │  │EmptyState│◄────►│  │  loadTasks()       │  │    │   │
│  │  │  └─────────┘ │      │  │  saveTasks()       │  │    │   │
│  │  │              │      │  │  isValidTask()     │  │    │   │
│  │  │  ┌─────────┐ │      │  └────────────────────┘  │    │   │
│  │  │  │ErrorBanner│◄────►│                          │    │   │
│  │  │  └─────────┘ │      │  ┌────────────────────┐  │    │   │
│  │  └──────────────┘      │  │   Renderer         │  │    │   │
│  │                         │  │  renderTaskList()  │  │    │   │
│  │                         │  └────────────────────┘  │    │   │
│  │                         └──────────────────────────┘    │   │
│  │                                    │                     │   │
│  │                         ┌──────────▼──────────┐         │   │
│  │                         │  window.localStorage│         │   │
│  │                         │  key: "todoapp_tasks"│         │   │
│  │                         │  value: Task[] JSON  │         │   │
│  │                         └─────────────────────┘         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

        ┌──────────────────────────────────┐
        │       Deployment Topology        │
        │                                  │
        │  Static File Host (CDN / GitHub  │
        │  Pages / Netlify / any file host)│
        │                                  │
        │  index.html                      │
        │  app.js  (or app.ts bundled)     │
        │  styles.css                      │
        └──────────────────────────────────┘
              │  served once on load
              ▼
           Browser
```

### 1.3 Deployment Topology

| Concern | Detail |
|---------|--------|
| Hosting | Any static file host: GitHub Pages, Netlify, Vercel (static), S3+CloudFront, or local filesystem |
| Build artifact | `index.html`, `app.js` (bundled), `styles.css` — all static, no server-side rendering |
| Runtime environment | End-user browser only |
| Network calls at runtime | None |
| CI/CD | Optional: bundle with Vite/esbuild → deploy static output |

### 1.4 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| No backend | Frontend-only | PRD requirement; zero infrastructure cost; broadest reach |
| No authentication | Omitted | Single-user personal tool; out of scope for v1 |
| Persistence layer | `window.localStorage` | Survives page refresh/restart without a server; universally available in target browsers |
| State management | In-memory `Task[]` array, mutated in place | Simplest correct approach for a single-user single-page app with no concurrency concerns |
| Rendering | Synchronous full re-render of task list on every mutation | Eliminates diffing complexity; task lists at this scale render in < 1 ms |
| ID generation | `crypto.randomUUID()` with `Date.now()` fallback | Cryptographically random; collision-free in practice; no server round-trip required |
| Error handling | In-memory revert + user-visible banner; silent console fallbacks for developer errors | Keeps UI resilient without a complex state machine |

---

## 2. Component Architecture

### 2.1 Module Overview

TodoApp is structured as a single JavaScript module (or a small set of ES modules) with four logical responsibilities:

```
app.js (or equivalent bundle entry)
├── TaskStore        — persistence layer (localStorage read/write)
├── TaskActions      — mutation functions (add / toggle / delete)
├── Renderer         — DOM output (renderTaskList)
└── EventHandlers    — browser event binding (wires DOM events to actions)
```

### 2.2 Component Descriptions

#### TaskStore

**Responsibility:** All interaction with `window.localStorage`. This component owns the `"todoapp_tasks"` storage key, the JSON serialisation/deserialisation contract, and all error handling for storage failures.

**Public surface:**
- `loadTasks()` — called once on `DOMContentLoaded`; returns `Task[]` (always an array, never null)
- `saveTasks(tasks)` — called after every mutation; throws `StorageError` on failure
- `isValidTask(item)` — pure predicate; used during deserialisation to filter malformed items

**Invariants:**
- Never throws from `loadTasks`; all exceptions are caught and return `[]`
- `saveTasks` throws before any DOM update so the caller can revert state and display an error
- `isValidTask` is a pure function with no side effects

---

#### TaskActions

**Responsibility:** High-level mutation functions that coordinate state changes. Each function validates input, mutates the in-memory `tasks[]` array, delegates persistence to `TaskStore`, and triggers a re-render via `Renderer`. On storage failure, each function reverts its mutation.

**Public surface:**
- `addTask(title: string) → Task` — validates title, creates Task, appends to array
- `toggleTask(taskId: string) → void` — flips `completed` for the identified task
- `deleteTask(taskId: string) → void` — removes task from array

**Invariants:**
- All mutations follow the sequence: **validate → mutate memory → saveTasks → renderTaskList**
- On `StorageError`, the sequence becomes: **validate → mutate memory → saveTasks (throws) → revert memory → show error message**
- Stale `taskId` (not found in array) is handled silently: call `renderTaskList` to resync DOM, return without throwing

---

#### Renderer

**Responsibility:** All DOM output. Converts the current `Task[]` array into the rendered HTML task list. Fully replaces the list container's inner HTML on every call (no diffing, full re-render).

**Public surface:**
- `renderTaskList(tasks: Task[]) → void` — idempotent; renders empty-state or task rows

**Invariants:**
- Idempotent: calling twice with identical input produces identical DOM
- After rendering, rebinds `change` listeners on checkboxes → `toggleTask` and `click` listeners on delete buttons → `deleteTask`
- Logs `console.error` and returns without rendering if the DOM container element is not found

---

#### EventHandlers

**Responsibility:** Bootstraps the app on `DOMContentLoaded` and binds the Add Form's event listeners (button click, Enter keydown). The task list's per-row listeners are rebound by `Renderer` after each render.

**Responsibilities:**
1. On `DOMContentLoaded`: call `loadTasks()`, store result in `tasks`, call `renderTaskList(tasks)`
2. Bind `click` on `#add-task-btn` → call `addTask(inputElement.value)`
3. Bind `keydown` on `#task-input` → on `Enter`, call `addTask(inputElement.value)`

---

### 2.3 Data Flow

```
DOMContentLoaded
      │
      ▼
loadTasks() ──► localStorage.getItem("todoapp_tasks")
      │
      ▼
tasks = Task[]  ──► renderTaskList(tasks)
                          │
                          ▼
                   DOM: task list rendered

User interaction (add / toggle / delete)
      │
      ▼
TaskAction function (addTask / toggleTask / deleteTask)
      │
      ├─► mutate tasks[]
      │
      ├─► saveTasks(tasks) ──► localStorage.setItem(...)
      │         │
      │         └── on error: revert tasks[] ──► show error banner
      │
      └─► renderTaskList(tasks) ──► DOM updated
```

---

## 3. Data Model

### 3.1 Overview

TodoApp v1 has **no relational database**. The sole persistence mechanism is `window.localStorage`. The entire data model consists of a single object type (`Task`) stored as a JSON-serialised array under one localStorage key.

### 3.2 Entity: Task

The `Task` object is the atomic unit of data in TodoApp. Each task represents one to-do item created by the user.

#### ER Diagram (single-entity)

```
┌──────────────────────────────────────┐
│                 Task                 │
├──────────────────────────────────────┤
│  id         string  PK  (UUID v4)   │
│  title      string  NOT NULL        │
│  completed  boolean NOT NULL        │
│  createdAt  number  (ms epoch)      │
└──────────────────────────────────────┘

Stored as: Task[]  →  JSON.stringify  →  localStorage["todoapp_tasks"]
```

#### Field Definitions

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | `string` | Yes | — | Non-empty; unique within array; UUID v4 or `Date.now().toString(36)` + random suffix | Stable identifier assigned at creation. Never changes after creation. |
| `title` | `string` | Yes | — | Non-empty after `trim()`; no maximum length enforced in v1 | The user-entered task description. Stored as trimmed. |
| `completed` | `boolean` | Yes | `false` | Strict boolean only (`true`/`false`); never `0`, `1`, or string | Whether the task has been marked done. Set to `false` at creation; toggled by F2. |
| `createdAt` | `number` | Recommended | `0` | Unix epoch milliseconds (`Date.now()`); `0` treated as absent for backwards-compat | Creation timestamp. Used for stable sort order. |

#### TypeScript Interface

```typescript
/**
 * The atomic unit of data in TodoApp v1.
 * Stored as Task[] JSON under localStorage["todoapp_tasks"].
 */
interface Task {
  /** Non-empty string; unique within the tasks array. UUID v4 preferred. */
  id: string;

  /** Non-empty string after trim(). The user-entered task description. */
  title: string;

  /** Always a strict boolean. false on creation; toggled by toggleTask(). */
  completed: boolean;

  /** Unix epoch ms (Date.now()) at creation time. 0 if absent (legacy). */
  createdAt: number;
}
```

### 3.3 Storage Schema

There is no DDL (no SQL database). The storage schema is the localStorage key-value contract:

| Key | Value Type | Encoding | Written By | Read By |
|-----|-----------|----------|-----------|--------|
| `"todoapp_tasks"` | `string` | `JSON.stringify(Task[])` — compact JSON array | `saveTasks()` after every mutation | `loadTasks()` on every page load |

**Wire format (pretty-printed for documentation; stored compact):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": 1746700800000
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "title": "Walk the dog",
    "completed": true,
    "createdAt": 1746701000000
  }
]
```

**Storage constraints:**

| Constraint | Detail |
|-----------|--------|
| Quota | Browser-dependent; typically 5–10 MB per origin |
| Origin scope | Data is scoped to the exact browser origin (protocol + host + port). Tasks on `localhost:3000` are not visible on a deployed URL. |
| Persistence | Survives page refresh and browser restart within the same browser profile on the same device |
| Single key | All tasks stored under one key; no secondary keys, indexes, or schema versioning in v1 |

### 3.4 Schema Invariants

1. **Uniqueness:** No two tasks in the array share the same `id`
2. **Non-empty title:** Every task's `title` is a non-empty string after trimming
3. **Boolean `completed`:** Always `true` or `false`; never `null`, `undefined`, `0`, `1`, or a string
4. **Array order = display order:** New tasks are appended to the end (highest index)
5. **No orphans:** Every stored task was explicitly created via `addTask()` and not yet deleted via `deleteTask()`

### 3.5 Schema Validation Predicate

```typescript
/**
 * Type guard used during loadTasks() deserialisation.
 * Returns true only if item is a valid Task object.
 * createdAt is optional (absent treated as 0).
 */
function isValidTask(item: unknown): item is Task {
  if (typeof item !== "object" || item === null) return false;
  const t = item as Record<string, unknown>;
  return (
    typeof t.id === "string" && t.id.length > 0 &&
    typeof t.title === "string" && t.title.length > 0 &&
    typeof t.completed === "boolean"
    // createdAt: optional; absence does not fail validation
  );
}
```

---

## 4. API Design — Client-Side Module Interface

> **Note:** TodoApp v1 has **no HTTP/REST API**. There are no network endpoints. The "API" is the client-side JavaScript module interface — a set of synchronous, in-process function calls that operate on the in-memory `tasks[]` array and side-effect into the DOM and `localStorage`.

### 4.1 Module Function Reference

#### 4.1.1 TaskStore Functions

---

**`loadTasks() → Task[]`**

Reads and deserialises the task array from `localStorage["todoapp_tasks"]`.

| Attribute | Value |
|-----------|-------|
| Parameters | None |
| Returns | `Task[]` — always an array; never `null` or `undefined`; may be `[]` |
| Throws | Never — all errors are caught internally; fallback is always `[]` |
| Side effects | Reads `localStorage`; may call `localStorage.removeItem` on corrupt data |
| Called by | EventHandlers bootstrap on `DOMContentLoaded` |

```typescript
function loadTasks(): Task[]
```

**Behaviour:**
1. Calls `localStorage.getItem("todoapp_tasks")` in a `try/catch`
2. On `SecurityError` (private browsing): logs `console.warn`, returns `[]`
3. On `null` result (first run / cleared): returns `[]`
4. On valid string: calls `JSON.parse` in a `try/catch`
   - On parse error or non-array result: calls `localStorage.removeItem`, logs `console.warn`, returns `[]`
   - On success: filters array through `isValidTask()`; returns filtered `Task[]`

---

**`saveTasks(tasks: Task[]) → void`**

Serialises and writes the full task array to `localStorage["todoapp_tasks"]`.

| Attribute | Value |
|-----------|-------|
| Parameters | `tasks: Task[]` — the current in-memory task array |
| Returns | `void` on success |
| Throws | `StorageError` with `.code = "STORAGE_QUOTA_EXCEEDED"` or `"STORAGE_WRITE_FAILED"` |
| Side effects | Writes to `localStorage` |
| Called by | `addTask`, `toggleTask`, `deleteTask` — always before `renderTaskList` |

```typescript
function saveTasks(tasks: Task[]): void
```

**Behaviour:**
1. Calls `JSON.stringify(tasks)` → serialised string
2. Calls `localStorage.setItem("todoapp_tasks", serialised)` in a `try/catch`
3. On `QuotaExceededError`: throws `StorageError` with code `STORAGE_QUOTA_EXCEEDED`
4. On any other error: throws `StorageError` with code `STORAGE_WRITE_FAILED`
5. On success: returns `void`; caller proceeds to `renderTaskList`

---

**`isValidTask(item: unknown) → boolean`**

Pure predicate function; validates that an unknown value conforms to the `Task` schema.

| Attribute | Value |
|-----------|-------|
| Parameters | `item: unknown` |
| Returns | `true` if item is a valid Task; `false` otherwise |
| Throws | Never |
| Side effects | None |

```typescript
function isValidTask(item: unknown): item is Task
```

---

#### 4.1.2 TaskActions Functions

---

**`addTask(title: string) → Task`**

Validates, creates, persists, and renders a new task.

| Attribute | Value |
|-----------|-------|
| Parameters | `title: string` — raw string from the input field |
| Returns | The newly created `Task` object on success |
| Throws | `ValidationError` (code `TASK_TITLE_EMPTY`) if `title.trim() === ""`; `StorageError` (propagated from `saveTasks`) on storage failure |
| Side effects | Mutates `tasks[]`; calls `saveTasks`; calls `renderTaskList`; clears and refocuses input DOM element |
| Called by | EventHandlers (button click, Enter keydown on `#task-input`) |

```typescript
function addTask(title: string): Task
```

**Behaviour (happy path):**
1. Compute `trimmedTitle = title.trim()`
2. If `trimmedTitle === ""`: throw `ValidationError` with code `TASK_TITLE_EMPTY`
3. Generate unique `id` using `crypto.randomUUID()` (retry up to 5× on collision)
4. Construct `newTask = { id, title: trimmedTitle, completed: false, createdAt: Date.now() }`
5. `tasks.push(newTask)`
6. Call `saveTasks(tasks)` — on `StorageError`: `tasks.pop()` (revert), rethrow
7. Call `renderTaskList(tasks)`
8. Clear `#task-input`, return focus to it
9. Return `newTask`

---

**`toggleTask(taskId: string) → void`**

Flips the `completed` state of the identified task.

| Attribute | Value |
|-----------|-------|
| Parameters | `taskId: string` — value of `data-task-id` on the checkbox element |
| Returns | `void` |
| Throws | `StorageError` (propagated from `saveTasks`) on storage failure |
| Side effects | Mutates `task.completed` in `tasks[]`; calls `saveTasks`; calls `renderTaskList` |
| Called by | Renderer (rebinds on each render) via checkbox `change` event |

```typescript
function toggleTask(taskId: string): void
```

**Behaviour (happy path):**
1. Find task `T` in `tasks[]` where `T.id === taskId`
2. If not found: call `renderTaskList(tasks)` (DOM resync), return
3. Store `previousCompleted = T.completed`
4. Set `T.completed = !T.completed`
5. Call `saveTasks(tasks)` — on `StorageError`: `T.completed = previousCompleted` (revert), rethrow
6. Call `renderTaskList(tasks)`

---

**`deleteTask(taskId: string) → void`**

Permanently removes the identified task from the array and storage.

| Attribute | Value |
|-----------|-------|
| Parameters | `taskId: string` — value of `data-task-id` on the delete button element |
| Returns | `void` |
| Throws | `StorageError` (propagated from `saveTasks`) on storage failure |
| Side effects | Removes item from `tasks[]`; calls `saveTasks`; calls `renderTaskList` |
| Called by | Renderer (rebinds on each render) via delete button `click` event |

```typescript
function deleteTask(taskId: string): void
```

**Behaviour (happy path):**
1. Find index `idx` of task `T` in `tasks[]` where `T.id === taskId`
2. If not found: call `renderTaskList(tasks)` (DOM resync), return
3. Store `removed = tasks.splice(idx, 1)[0]`
4. Call `saveTasks(tasks)` — on `StorageError`: `tasks.splice(idx, 0, removed)` (revert), rethrow
5. Call `renderTaskList(tasks)`

---

#### 4.1.3 Renderer Functions

---

**`renderTaskList(tasks: Task[]) → void`**

Fully replaces the task list DOM with the current state of `tasks[]`.

| Attribute | Value |
|-----------|-------|
| Parameters | `tasks: Task[]` |
| Returns | `void` |
| Throws | Never — logs `console.error` if DOM container missing; does not throw |
| Side effects | Replaces inner HTML of `#task-list` container; rebinds event listeners |
| Called by | EventHandlers (initial render); `addTask`, `toggleTask`, `deleteTask` (after each mutation) |

```typescript
function renderTaskList(tasks: Task[]): void
```

**Behaviour:**
- If DOM container `#task-list` not found: `console.error("DOM container #task-list not found")`, return
- If `tasks.length === 0`: hide `#task-list`, show `#empty-state`
- If `tasks.length > 0`: hide `#empty-state`, show `#task-list`, render one `<li>` per task:

```html
<li data-task-id="{id}">
  <input
    type="checkbox"
    data-task-id="{id}"
    aria-label="Mark task complete"
    [checked if completed]
  />
  <span class="task-title {completed ? 'completed' : ''}">
    {title}
  </span>
  <button
    data-task-id="{id}"
    aria-label="Delete task"
  >
    Delete
  </button>
</li>
```

- After rendering all rows, rebind:
  - Each checkbox `change` event → `toggleTask(checkbox.dataset.taskId)`
  - Each delete button `click` event → `deleteTask(button.dataset.taskId)`

---

### 4.2 Error Types

```typescript
/**
 * Thrown by addTask() when title is empty or whitespace-only.
 */
class ValidationError extends Error {
  code: "TASK_TITLE_EMPTY";
  constructor() {
    super("Task title cannot be empty.");
    this.code = "TASK_TITLE_EMPTY";
  }
}

/**
 * Thrown by saveTasks() when localStorage write fails.
 * Propagated to addTask / toggleTask / deleteTask callers.
 */
class StorageError extends Error {
  code: "STORAGE_READ_FAILED" | "STORAGE_WRITE_FAILED" | "STORAGE_QUOTA_EXCEEDED" | "STORAGE_CORRUPT";
  constructor(code: StorageError["code"], message: string) {
    super(message);
    this.code = code;
  }
}
```

### 4.3 Error Code Reference

| Error Code | Class | Raised By | Trigger | User-Visible Message |
|------------|-------|-----------|---------|----------------------|
| `TASK_TITLE_EMPTY` | `ValidationError` | `addTask` | `title.trim() === ""` | `"Task title cannot be empty."` |
| `TASK_NOT_FOUND` | Internal (silent) | `toggleTask`, `deleteTask` | `taskId` not in `tasks[]` | None (DOM resync only) |
| `TASK_ID_COLLISION` | Internal (silent) | `addTask` | Generated `id` already exists | None (auto-retry up to 5×) |
| `TASK_SCHEMA_INVALID` | Internal (silent) | `loadTasks`, `renderTaskList` | Malformed item in deserialised array | None (item skipped) |
| `STORAGE_READ_FAILED` | `StorageError` | `loadTasks` | `localStorage.getItem` throws | None (empty state shown) |
| `STORAGE_CORRUPT` | `StorageError` | `loadTasks` | JSON.parse fails or non-array | None (empty state; key removed) |
| `STORAGE_QUOTA_EXCEEDED` | `StorageError` | `saveTasks` → surfaces in F1/F2/F3 | `QuotaExceededError` on `setItem` | `"Storage full. Delete some tasks to free space."` |
| `STORAGE_WRITE_FAILED` | `StorageError` | `saveTasks` → surfaces in F1/F2/F3 | Any other `setItem` error | `"Could not save. Please try again."` |
| `DOM_CONTAINER_MISSING` | Internal (dev error) | `renderTaskList` | `#task-list` not in DOM | None (`console.error` only) |

### 4.4 UI HTML Element Reference

| Element ID / Selector | Type | Role |
|----------------------|------|------|
| `#task-input` | `<input type="text">` | Task title input field (Add Form) |
| `#add-task-btn` | `<button>` | Submit button for Add Form |
| `#task-list` | `<ul>` or `<ol>` | Container for rendered Task Rows; hidden on empty state |
| `#empty-state` | `<p>` or `<div>` | Empty-state message; shown when `tasks.length === 0` |
| `#error-banner` | `<div>` | Global error banner for storage errors; auto-dismisses after 5 s |
| `.task-title` | `<span>` | Task title text within a Task Row |
| `.task-title.completed` | `<span>` | Completed task title — receives `text-decoration: line-through` |
| `[data-task-id]` | attribute | Present on checkbox and delete button in every Task Row; value = `task.id` |

---

## 5. Security Architecture

### 5.1 Authentication & Authorization

TodoApp v1 has **no authentication and no authorization**. It is a single-user, single-device personal tool. There is no concept of user identity, sessions, tokens, or access control.

| Concern | v1 Status | Notes |
|---------|-----------|-------|
| Authentication | None | Explicitly out of scope for v1 |
| Authorization | None | Single user; no multi-user data |
| Sessions / tokens | None | No backend; no session management |
| Password handling | None | No credentials in scope |

### 5.2 Data Storage Security

All data is stored in `window.localStorage`, which is scoped to the browser origin (protocol + host + port). This provides the following properties:

| Property | Detail |
|---------|--------|
| **Origin isolation** | Tasks stored on `https://example.com` are not accessible from any other origin |
| **No server transmission** | Task data never leaves the user's browser — there is no network call at runtime |
| **No encryption** | `localStorage` data is stored in plaintext on the user's device filesystem. This is acceptable for v1 (personal, non-sensitive task titles). |
| **Cross-tab access** | Other tabs from the same origin can read/write the same localStorage key. In v1 this is acceptable; a future v2 could use the `storage` event to sync across tabs. |

### 5.3 Input Validation

| Input | Validation | Where Enforced |
|-------|-----------|----------------|
| Task title | `title.trim().length > 0` — rejects empty/whitespace | `addTask()` before any mutation |
| `taskId` (toggle/delete) | Must exist in `tasks[]` — stale IDs abort silently | `toggleTask()`, `deleteTask()` |
| Deserialised task objects | `isValidTask()` predicate — filters malformed items | `loadTasks()` after JSON.parse |

### 5.4 XSS Considerations

Since task titles are user-supplied strings rendered into the DOM, care must be taken:

- **Use `textContent` (not `innerHTML`)** when inserting task titles into the DOM to prevent script injection
- The `renderTaskList` function must set task titles via `span.textContent = task.title` (not `span.innerHTML`)
- Delete buttons and checkboxes must use `data-task-id` attributes set via `element.dataset.taskId = task.id` (not string concatenation into HTML templates)

If using an HTML template string approach for rendering, task title and ID values must be HTML-escaped before insertion:

```typescript
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

### 5.5 Storage Error Resilience

| Risk | Mitigation |
|------|-----------|
| `QuotaExceededError` on save | Caught in `saveTasks`; in-memory mutation reverted; user alerted to delete tasks |
| Corrupt JSON in localStorage | Detected in `loadTasks`; key removed; app resets to clean empty state |
| `SecurityError` (private browsing) | Caught in `loadTasks`; app runs in session-only mode; no user-visible error |

### 5.6 Content Security Policy (Recommended)

For production deployment, the following CSP header is recommended to mitigate XSS risk:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  object-src 'none';
  base-uri 'self'
```

---

## 6. Technology Stack

### 6.1 Core Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Language | HTML5 | Living Standard | App structure and markup |
| Language | CSS3 | Living Standard | Styling, layout, completion visual indicator |
| Language | JavaScript (ES2022+) or TypeScript | ES2022 / TS 5.x | Application logic |
| Persistence | `window.localStorage` | Web Storage API (WHATWG) | Task data persistence across page refreshes |
| ID generation | `crypto.randomUUID()` | Web Crypto API (W3C) | Collision-free task ID generation |

### 6.2 Build & Tooling (Recommended)

| Tool | Version | Purpose | Required? |
|------|---------|---------|-----------|
| Vite | 5.x | Dev server + fast bundler for TypeScript/JS | Recommended |
| TypeScript | 5.x | Static typing for safety and autocomplete | Optional (plain JS acceptable) |
| ESLint | 9.x | Code quality and consistency | Recommended |
| Prettier | 3.x | Code formatting | Recommended |
| Vitest | 2.x | Unit testing (TaskStore, TaskActions logic) | Recommended |

**Note:** All build tooling is development-only. The production artifact is pure static HTML/CSS/JS — no runtime build tool dependencies.

### 6.3 Target Browser Matrix

| Browser | Min Version | `localStorage` | `DOMContentLoaded` | `crypto.randomUUID` |
|---------|------------|----------------|--------------------|--------------------|
| Chrome | Current − 1 (≥ 137) | ✅ | ✅ | ✅ (≥ 92) |
| Firefox | Current − 1 (≥ 137) | ✅ | ✅ | ✅ (≥ 95) |
| Safari | Current − 1 (≥ 17) | ✅ | ✅ | ✅ (≥ 15.4) |
| Edge | Current − 1 (≥ 135) | ✅ | ✅ | ✅ (≥ 92) |

No polyfills are required. All browser APIs used are natively available in all target browsers.

### 6.4 Performance Budget

| Metric | Target | Approach |
|--------|--------|---------|
| Initial page load | < 2 s on broadband | Static files; no server-side rendering; minimal bundle size |
| Task list render | < 100 ms | Synchronous in-memory render; no network dependency |
| CRUD interaction response | < 50 ms | Synchronous `localStorage` write + DOM re-render |
| Bundle size | < 50 KB (gzipped) | No framework; plain JS/TS; Vite tree-shaking |

---

## 7. Integration Points

### 7.1 External Integrations

**TodoApp v1 has no external third-party service integrations.** There are no API calls, no analytics, no authentication providers, and no cloud services.

### 7.2 Browser API Dependencies

| API | Interface | Methods Used | Fallback on Unavailability |
|-----|-----------|-------------|---------------------------|
| Web Storage | `window.localStorage` | `getItem`, `setItem`, `removeItem` | Session-only in-memory mode; empty state on reload |
| Web Crypto | `crypto.randomUUID()` | `randomUUID()` | `Date.now().toString(36) + Math.random().toString(36).slice(2)` |
| DOM Events | `document` event model | `DOMContentLoaded`, `click`, `change`, `keydown` | None (JS-required app) |
| JSON (built-in) | `JSON` global | `stringify`, `parse` | None (universally available) |

### 7.3 Out-of-Scope Integrations (v1)

The following integrations are explicitly excluded from v1 and deferred to future iterations:

| Integration | Reason Excluded | Future Version |
|-------------|----------------|----------------|
| Cloud sync (Firebase, Supabase) | No backend in v1 | v2+ |
| Authentication (OAuth, MSAL, Auth0) | No auth in v1 | v2+ |
| Push notifications / reminders | No due-date feature in v1 | v2+ |
| Service Worker / PWA offline cache | `localStorage` is the only offline mechanism needed | v2+ |
| Analytics (Plausible, GA4) | Out of scope for v1 | v2+ |
| Error monitoring (Sentry, Rollbar) | `console.error/warn` is sufficient for v1 | v2+ |
| IndexedDB | `localStorage` is sufficient at this data scale | v3+ (if quota becomes an issue) |

---

## Appendix A: File Structure

```
todoapp/
├── index.html              ← Single HTML page; app entry point
├── src/
│   ├── main.ts             ← EventHandlers bootstrap (DOMContentLoaded)
│   ├── store.ts            ← TaskStore: loadTasks, saveTasks, isValidTask
│   ├── actions.ts          ← TaskActions: addTask, toggleTask, deleteTask
│   ├── renderer.ts         ← Renderer: renderTaskList
│   ├── types.ts            ← TypeScript interfaces: Task, ValidationError, StorageError
│   └── utils.ts            ← escapeHtml, generateId
├── styles/
│   └── app.css             ← All styles including .task-title.completed strikethrough
├── tests/
│   ├── store.test.ts       ← Unit tests for loadTasks, saveTasks, isValidTask
│   └── actions.test.ts     ← Unit tests for addTask, toggleTask, deleteTask
├── vite.config.ts          ← Vite build config
├── tsconfig.json           ← TypeScript config
└── package.json            ← Dependencies and scripts
```

---

## Appendix B: State Machine — Task Lifecycle

```
                  ┌─────────────┐
                  │  [Created]  │
                  │completed:   │
                  │  false      │
                  └──────┬──────┘
                         │  user clicks checkbox
                         ▼
              ┌─────────────────────┐
              │    [Completed]      │◄──┐
              │  completed: true    │   │ user clicks checkbox
              └──────────┬──────────┘   │ (un-complete)
                         │              │
                         └──────────────┘
                         │
                         │  user clicks delete (any state)
                         ▼
                  ┌─────────────┐
                  │  [Deleted]  │
                  │  (removed   │
                  │  from array)│
                  └─────────────┘
```

---

*TechArch generated: 2026-05-08 | Model: claude-sonnet-4-6 | Source: PRD-TodoApp.md + FRD-TodoApp.md*
