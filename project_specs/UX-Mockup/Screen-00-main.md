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
