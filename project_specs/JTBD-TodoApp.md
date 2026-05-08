# Jobs-to-be-Done — TodoApp

| Field              | Value                                        |
|--------------------|----------------------------------------------|
| **Product**        | TodoApp — Basic To-Do App                    |
| **Version**        | 1.0                                          |
| **Date**           | 2026-05-08                                   |
| **Related Personas** | PERSONAS-TodoApp.md                        |
| **Related PRD**    | PRD-TodoApp.md                               |
| **Status**         | Draft                                        |

---

## JTBD Summary

| JTBD-ID     | Persona               | Job Statement (abbreviated)                                              | Priority |
|-------------|-----------------------|--------------------------------------------------------------------------|----------|
| JTBD-01.1   | PER-01 Marcus Webb    | Capture a task instantly without signing up or waiting                   | P0       |
| JTBD-01.2   | PER-01 Marcus Webb    | Dismiss a completed task in one action and keep moving                   | P0       |
| JTBD-01.3   | PER-01 Marcus Webb    | Return to a browser tab and find tasks exactly as left                   | P0       |
| JTBD-02.1   | PER-02 Priya Sharma   | Build a full daily checklist at the start of the day without friction    | P0       |
| JTBD-02.2   | PER-02 Priya Sharma   | Track completion state visually throughout the day at a glance           | P0       |
| JTBD-02.3   | PER-02 Priya Sharma   | Maintain a clean, trustworthy list mid-day as priorities shift           | P0       |

---

## PER-01: Marcus Webb — Casual Jotter

### JTBD-01.1: Frictionless Task Capture

**Job Statement:**
When I am mid-task and a new to-do surfaces in my head, I want to open an app and type it in immediately, so I can offload the thought and return to what I was doing without losing focus.

**Current Alternatives:**
- Uses iOS Notes or a blank Google Doc — requires unlocking phone or switching apps, then scrolling past existing content
- Types into a browser address bar as a placeholder and loses it when the tab navigates
- Relies on memory until a free moment — often forgets the task entirely

**Hiring Criteria:**
- No account, login, or onboarding screen between opening the URL and typing
- Text input is focused and ready immediately on page load (no click needed to activate)
- Task appears in the list and is saved within 1 second of pressing Enter
- Works in any browser without installing an extension or app

**Success Measure:** A new user creates their first task in under 30 seconds from the moment they open the app for the first time — with zero prior instructions.

**Related Features:** F0, F1, F4
**Priority:** P0

---

### JTBD-01.2: One-Action Task Dismissal

**Job Statement:**
When I finish a task and want to clear it from my list, I want to remove it in a single click with no confirmation dialog, so I can keep my list clean and move on without interruption.

**Current Alternatives:**
- Uses apps that show a "Are you sure?" confirmation prompt — adds cognitive friction mid-flow
- Marks tasks "done" in a checklist app but leaves them cluttering the list
- Manually highlights and deletes text from a notes file — slow and error-prone

**Hiring Criteria:**
- A single visible delete control per task item (button or icon)
- Task disappears from the list immediately on click — no modal, no undo toast blocking the UI
- Deletion is permanent and reflected in local storage without any explicit "save" step
- Interaction completes in under 50 ms (feels instantaneous)

**Success Measure:** Marcus can remove a task from a list of 5 items in under 3 seconds from decision to cleared screen, without any confirmation step.

**Related Features:** F3, F4
**Priority:** P0

---

### JTBD-01.3: Reliable Tab Persistence

**Job Statement:**
When I return to my browser tab after working in other apps or leaving for a meeting, I want all my tasks to be exactly where I left them, so I can trust the app as a reliable external memory without any manual saving ritual.

**Current Alternatives:**
- Keeps a browser tab open with a notes app, but tasks disappear on tab reload or browser update
- Sends himself emails or Slack messages as reminders — fragmented and hard to scan
- Relies on sticky notes on his physical monitor — not accessible from other devices or workspaces

**Hiring Criteria:**
- Full task list (titles and any completion states) restored automatically on every page load
- No explicit "save" button required — persistence is automatic and invisible
- Survives page refresh, browser restart, and returning to a pinned tab after hours
- Handles first-launch gracefully with a clean empty state (no errors on missing storage data)

**Success Measure:** Zero task-loss incidents across 20 simulated page refreshes and 2 browser restarts in manual testing — 100% persistence reliability.

**Related Features:** F0, F4
**Priority:** P0

---

## PER-02: Priya Sharma — Daily Checklist Keeper

### JTBD-02.1: Morning Checklist Construction

**Job Statement:**
When I sit down at the start of my workday, I want to quickly enter all the tasks I need to accomplish today, so I can have a single, visible checklist that anchors my day without switching between tools.

**Current Alternatives:**
- Uses a shared project-management tool (e.g., Jira, Asana) — mixed with team tasks, noisy, not personal
- Writes a paper checklist in a notebook — not accessible from other workstations or when on a call
- Uses a notes app in a browser tab — no structured task format, no completion tracking

**Hiring Criteria:**
- Can enter 5–10 tasks in rapid succession using only the keyboard (Enter to submit each task)
- Each submitted task appears in the list instantly without clearing focus from the input field — or input re-focuses automatically
- No friction between tasks — the app stays ready to accept the next entry immediately
- All tasks persist from entry to end of day without any manual save

**Success Measure:** Priya can enter 8 tasks back-to-back in under 60 seconds from page open, using only keyboard input, with all tasks correctly appearing and persisted.

**Related Features:** F0, F1, F4
**Priority:** P0

---

### JTBD-02.2: At-a-Glance Completion Tracking

**Job Statement:**
When I return to my task list after a meeting or break, I want to immediately see which tasks are done and which are still pending without reading every item, so I can reorient quickly and decide where to direct my attention next.

**Current Alternatives:**
- Manually crosses items off a paper list — not available when away from desk
- Uses colour-coded sticky notes — hard to scale past 5 items, not keyboard-accessible
- Uses a shared team tool but filters out her own tasks — slow and cumbersome

**Hiring Criteria:**
- Completed tasks are visually distinct from pending tasks at a glance (e.g., strikethrough + muted color)
- Toggling a task's completion state is a single click or keypress and takes effect immediately
- Completion state persists across page refreshes — a task marked done is still done after returning from a meeting
- Toggle is reversible — she can un-complete a task if priorities change

**Success Measure:** Priya can identify which tasks are pending (vs. done) in a list of 10 mixed-state tasks in under 5 seconds without any instructions, with 100% completion-state accuracy after a page refresh.

**Related Features:** F0, F2, F4
**Priority:** P0

---

### JTBD-02.3: Mid-Day List Hygiene

**Job Statement:**
When priorities shift during the day and new tasks emerge or stale ones become irrelevant, I want to add or remove items from my list without disrupting my current work, so I can keep my checklist accurate and trustworthy throughout the entire day.

**Current Alternatives:**
- Edits a text document — requires opening, scrolling, selecting, deleting; breaks focus
- Starts a new paper checklist mid-day — loses history of what was already done
- Leaves irrelevant tasks in the list — clutters the view and reduces trust in the list

**Hiring Criteria:**
- New tasks can be added at any point in the day with a single keyboard action (Enter to submit)
- Stale tasks can be removed in a single click with no confirmation step
- The list reflects changes immediately — no page reload or save action needed
- The input field is always visible without scrolling so adding a task never requires navigation

**Success Measure:** Priya can add one new task and delete one stale task mid-day in under 10 seconds total, without leaving her current context or scrolling the page.

**Related Features:** F0, F1, F3, F4
**Priority:** P0

---

## Outcome-to-Feature Traceability

| JTBD-ID   | Related Features | Expected Outcome                                                                                     |
|-----------|------------------|------------------------------------------------------------------------------------------------------|
| JTBD-01.1 | F0, F1, F4       | New user creates first task in < 30 s with zero onboarding; task persists immediately                |
| JTBD-01.2 | F3, F4           | Task removed in one click with no confirmation dialog; deletion reflected in storage instantly        |
| JTBD-01.3 | F0, F4           | All tasks restored on every page load; zero data-loss incidents across refresh and restart cycles     |
| JTBD-02.1 | F0, F1, F4       | 8 tasks entered via keyboard in < 60 s; each appears instantly; all persist to end of session        |
| JTBD-02.2 | F0, F2, F4       | Done/pending distinction is immediately visible; completion state survives page refresh 100% of time |
| JTBD-02.3 | F0, F1, F3, F4   | Task added or deleted mid-day in < 10 s total; list updates in real time without page reload         |

---

## NaC Preview

*Candidate Natural Acceptance Criteria — to be refined in STORY-MAP*

| JTBD-ID   | Outcome                                         | Candidate Natural Acceptance Criterion                                                                                              |
|-----------|-------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| JTBD-01.1 | First task created in < 30 s, no login          | Given a user opens the app for the first time, when they type a task title and press Enter, then the task appears in the list within 1 second and no account prompt is shown |
| JTBD-01.2 | Task deleted in one click, no confirmation      | Given a task exists in the list, when the user clicks the delete control, then the task is removed from the list and from local storage immediately with no confirmation dialog |
| JTBD-01.3 | Tasks survive page refresh and browser restart  | Given a user has 3 tasks in the list, when they refresh the page, then all 3 tasks appear in the list with their titles and states intact |
| JTBD-02.1 | 8 tasks entered via keyboard in < 60 s          | Given the app is open with an empty list, when the user types 8 task titles pressing Enter after each, then all 8 tasks appear in order and input re-focuses automatically after each submission |
| JTBD-02.2 | Done/pending visually distinct; state persists  | Given a user marks 3 of 5 tasks as complete, when they refresh the page, then the 3 completed tasks display with strikethrough styling and the 2 pending tasks display without it |
| JTBD-02.3 | Add + delete mid-day in < 10 s, no nav needed   | Given the task input is visible without scrolling, when the user adds a new task and deletes an existing task, then both actions complete within the same page view with no reload required |

---

*JTBD generated: 2026-05-08 | Model: claude-sonnet-4-6 | Source: PERSONAS-TodoApp.md + PRD-TodoApp.md | Next: FRD-TodoApp.md*
