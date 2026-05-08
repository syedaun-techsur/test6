# Story Map — TodoApp

| Field                | Value                                                                        |
|----------------------|------------------------------------------------------------------------------|
| **Product**          | TodoApp — Basic To-Do App                                                    |
| **Version**          | 1.0                                                                          |
| **Date**             | 2026-05-08                                                                   |
| **Related Personas** | PERSONAS-TodoApp.md (PER-01, PER-02)                                         |
| **Related JTBD**     | JTBD-TodoApp.md (JTBD-01.1–01.3, JTBD-02.1–02.3)                            |
| **Related Journeys** | JOURNEYS-TodoApp.md (JRN-01.1–01.3, JRN-02.1–02.3)                          |
| **Related Stories**  | UserStories-TodoApp.md (US-0.1–US-4.5, 20 stories)                          |
| **Related PRD**      | PRD-TodoApp.md (F0–F4)                                                       |
| **Status**           | Draft                                                                        |

---

## Overview

This Story Map organises all 20 user stories onto a two-dimensional grid:

- **X-axis (columns):** Journey stages drawn from JOURNEYS-TodoApp.md — the sequence of steps each persona takes through the product.
- **Y-axis (rows):** Stories within each epic, grouped by feature area (Epic 0–4).
- **NaC column:** Natural Acceptance Criteria — testable criteria derived from the intersection of a JTBD outcome, a journey stage, and the story being placed. NaC are *not* invented; every NaC traces back to a specific JTBD-ID.
- **Release column:** Increment assignment. All features are P0 (MVP-critical); this project ships as a single release (R1).

### NaC Concept

> **NaC (Natural Acceptance Criterion)** = JTBD Outcome × Journey Stage → Testable Criterion
>
> Example: JTBD-01.1 "Capture a task instantly" × Stage "Type & Submit" → "Given the app is open, when the user types a task title and presses Enter, then the task appears in the list within 1 s and no login prompt is shown."

NaC complement the formal Acceptance Criteria in each User Story; they express the *user-felt outcome* rather than the implementation detail.

---

## Story Map Matrix

Journey stages are the columns. Each row is a story placed at its primary journey stage. A story may touch multiple stages; the **primary stage** is where the user's action occurs.

### Journey Stage Definitions

| Stage ID        | Stage Name              | Journey(s)                       | Primary Feature |
|-----------------|-------------------------|----------------------------------|-----------------|
| STG-A: Arrive   | Open/navigate to app    | JRN-01.1, JRN-01.3, JRN-02.1    | F0, F4          |
| STG-B: Orient   | Scan and understand UI  | JRN-01.1, JRN-01.2, JRN-02.2    | F0              |
| STG-C: Enter    | Type and submit task(s) | JRN-01.1, JRN-01.2, JRN-02.1, JRN-02.3 | F1       |
| STG-D: Track    | Mark complete / toggle  | JRN-02.2, JRN-02.3              | F2              |
| STG-E: Clean    | Delete stale tasks      | JRN-01.2, JRN-02.3              | F3              |
| STG-F: Persist  | Return; trust saved data| JRN-01.3, JRN-02.1, JRN-02.2   | F4              |

---

### Core Map Table

| SM-ID   | Persona            | Primary Stage     | Epic (Feature)       | Story ID | Story Title                                      | NaC (derived from JTBD)                                                                                                                   | Release |
|---------|--------------------|-------------------|----------------------|----------|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|---------|
| SM-0.1  | PER-02 Priya       | STG-A: Arrive     | Epic 0 (F0)          | US-0.1   | View All Tasks on Page Load                      | **JTBD-01.3 / JTBD-02.1** → Given the user returns to the app, all tasks stored in local storage render on screen within 100 ms of page load, with no user action required. | R1 |
| SM-0.2  | PER-01 Marcus      | STG-A: Arrive     | Epic 0 (F0)          | US-0.2   | View Empty State on First Load                   | **JTBD-01.1** → Given no prior tasks exist, when the user opens the app for the first time, then a clear prompt ("No tasks yet — add one above!") appears immediately with no error and no login gate. | R1 |
| SM-0.3  | PER-02 Priya       | STG-B: Orient     | Epic 0 (F0)          | US-0.3   | See Real-Time List Updates                       | **JTBD-02.3** → Given the user adds, toggles, or deletes a task, when the action completes, then the task list reflects the change in the same event-loop tick — no page refresh required. | R1 |
| SM-0.4  | PER-02 Priya       | STG-D: Track      | Epic 0 (F0)          | US-0.4   | See Completed Tasks Visually Distinguished       | **JTBD-02.2** → Given a user marks tasks complete, when they scan the list, then completed tasks show strikethrough + muted style and pending tasks show none — done/pending split is legible in < 5 s. | R1 |
| SM-1.1  | PER-01 Marcus      | STG-C: Enter      | Epic 1 (F1)          | US-1.1   | Add a Task via the Add Button                    | **JTBD-01.1** → Given the input field is visible at the top, when the user types a title and clicks "Add Task", then the task appears in the list immediately and the input clears and re-focuses — no mouse navigation needed afterward. | R1 |
| SM-1.2  | PER-02 Priya       | STG-C: Enter      | Epic 1 (F1)          | US-1.2   | Add a Task via the Enter Key                     | **JTBD-02.1** → Given the task input is focused, when the user presses Enter, then the task is submitted, the input clears, and focus returns automatically — enabling back-to-back keyboard entry of 8+ tasks in < 60 s. | R1 |
| SM-1.3  | PER-01 Marcus      | STG-C: Enter      | Epic 1 (F1)          | US-1.3   | Prevent Empty Task Submission                    | **JTBD-01.1** → Given the user submits an empty input, when the submission fires, then no task is created, a validation message appears, and the input remains focused so the user can correct it immediately. | R1 |
| SM-1.4  | PER-01 Marcus      | STG-C: Enter      | Epic 1 (F1)          | US-1.4   | Handle Storage Error When Adding a Task          | **JTBD-01.3** → Given storage is full or unavailable, when the user submits a task, then a clear error message is shown, the task is rolled back from the list, and the user knows to take action — no silent data loss. | R1 |
| SM-2.1  | PER-02 Priya       | STG-D: Track      | Epic 2 (F2)          | US-2.1   | Mark a Task as Complete                          | **JTBD-02.2** → Given a pending task exists, when the user clicks its checkbox, then `completed: true` is set, strikethrough appears immediately (< 50 ms), and the state is saved to local storage in the same tick. | R1 |
| SM-2.2  | PER-02 Priya       | STG-D: Track      | Epic 2 (F2)          | US-2.2   | Un-complete a Completed Task                     | **JTBD-02.2** → Given a completed task, when the user unchecks it, then strikethrough is removed immediately and `completed: false` is persisted — enabling mid-day re-prioritisation without losing any other task state. | R1 |
| SM-2.3  | PER-02 Priya       | STG-F: Persist    | Epic 2 (F2)          | US-2.3   | Completion State Persists Across Page Refresh    | **JTBD-02.2 / JTBD-01.3** → Given a user has marked 3 of 5 tasks complete, when they refresh the page, then all 3 completed tasks still show strikethrough and the 2 pending tasks do not — 100% state fidelity. | R1 |
| SM-2.4  | PER-02 Priya       | STG-D: Track      | Epic 2 (F2)          | US-2.4   | Handle Storage Error When Toggling Completion    | **JTBD-02.2** → Given a storage error on toggle, when the error is caught, then the checkbox reverts to its prior state, an error banner is shown, and the displayed state matches stored state — no visual lie to the user. | R1 |
| SM-3.1  | PER-01 Marcus      | STG-E: Clean      | Epic 3 (F3)          | US-3.1   | Delete a Task with One Click                     | **JTBD-01.2** → Given a task exists, when the user clicks its delete icon, then the task disappears from the list immediately (< 50 ms) with no confirmation dialog — one click from decision to cleared screen. | R1 |
| SM-3.2  | PER-01 Marcus      | STG-E: Clean      | Epic 3 (F3)          | US-3.2   | Empty State Shown After Last Task Is Deleted     | **JTBD-01.2** → Given the user deletes their last task, when the list becomes empty, then the empty-state message appears immediately and the user can still add a new task — no broken or stuck UI state. | R1 |
| SM-3.3  | PER-01 Marcus      | STG-E: Clean      | Epic 3 (F3)          | US-3.3   | Handle Storage Error When Deleting a Task        | **JTBD-01.2** → Given a storage error on delete, when the error is caught, then the task is re-inserted at its original position, an error banner is shown, and the list matches the stored state — no phantom deletions. | R1 |
| SM-4.1  | PER-02 Priya       | STG-F: Persist    | Epic 4 (F4)          | US-4.1   | Tasks Are Automatically Saved on Every Change    | **JTBD-02.3 / JTBD-01.3** → Given any add, toggle, or delete action, when it completes, then local storage is updated synchronously before the DOM renders — no explicit save required, no data-loss risk. | R1 |
| SM-4.2  | PER-02 Priya       | STG-F: Persist    | Epic 4 (F4)          | US-4.2   | Tasks Are Restored on Page Load                  | **JTBD-01.3 / JTBD-02.1** → Given a user returns to the app after a browser restart, when `DOMContentLoaded` fires, then the full task array (titles and completion states) is restored from local storage with zero data loss. | R1 |
| SM-4.3  | PER-01 Marcus      | STG-A: Arrive     | Epic 4 (F4)          | US-4.3   | Graceful First-Run Behaviour                     | **JTBD-01.1** → Given a user opens the app for the first time with no local storage key, when the page loads, then an empty list and empty-state prompt are shown with no errors and full functionality available immediately. | R1 |
| SM-4.4  | PER-01 Marcus      | STG-F: Persist    | Epic 4 (F4)          | US-4.4   | Graceful Recovery from Corrupt Storage Data      | **JTBD-01.3** → Given stored JSON is malformed, when the app loads, then corrupt data is cleared, the app starts fresh with an empty list, valid surviving tasks render, and no error is shown to the user. | R1 |
| SM-4.5  | PER-01 Marcus      | STG-F: Persist    | Epic 4 (F4)          | US-4.5   | Graceful Handling When Local Storage Unavailable | **JTBD-01.3** → Given local storage is blocked (e.g., private browsing), when the app loads, then it functions as a session-only in-memory list with no error screen — the user can still use the full workflow for their session. | R1 |

**Total stories mapped: 20 / 20 — no orphans.**

---

## NaC Derivation Table

Full traceability chain: JTBD outcome → Journey stage → NaC statement → Story.

| JTBD-ID   | JTBD Outcome (abbreviated)                      | Journey Stage (primary)            | NaC Statement                                                                                                               | Story IDs            |
|-----------|-------------------------------------------------|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|----------------------|
| JTBD-01.1 | Capture a task instantly — no login, no wait    | STG-A: Arrive (JRN-01.1)           | First-time user opens app → empty-state prompt visible immediately, no login gate, input focused and ready                  | US-0.2, US-4.3       |
| JTBD-01.1 | Capture a task instantly — no login, no wait    | STG-C: Enter (JRN-01.1, JRN-01.2) | User types title + presses Enter/clicks Add → task in list within 1 s, input clears and re-focuses, no save step needed     | US-1.1, US-1.2, US-1.3 |
| JTBD-01.2 | Dismiss a completed task — one click, no dialog | STG-E: Clean (JRN-01.2)           | User clicks delete icon → task removed immediately (< 50 ms), no confirmation dialog, list and storage updated in one action | US-3.1, US-3.2, US-3.3 |
| JTBD-01.3 | Return to tab and find tasks exactly as left    | STG-A: Arrive (JRN-01.3)           | Page loads (refresh or restart) → full task array restored from local storage before any user interaction                   | US-0.1, US-4.2       |
| JTBD-01.3 | Return to tab and find tasks exactly as left    | STG-F: Persist (JRN-01.3)          | Every mutation auto-saves; corrupt/blocked storage handled gracefully — zero silent data loss in any scenario               | US-4.1, US-4.4, US-4.5 |
| JTBD-01.3 | Return to tab and find tasks exactly as left    | STG-F: Persist (JRN-01.2)          | Storage error on add/toggle/delete → task rolled back + error banner shown; displayed state always matches stored state     | US-1.4, US-2.4, US-3.3 |
| JTBD-02.1 | Build full daily checklist via keyboard only    | STG-C: Enter (JRN-02.1)           | 8 tasks typed with Enter after each → all appear instantly in insertion order, input re-focuses each time, all persist       | US-1.2, US-0.3       |
| JTBD-02.2 | Track completion state visually at a glance     | STG-D: Track (JRN-02.2)           | Checkbox toggle → strikethrough/muted style applied < 50 ms; toggle is reversible; state survives page refresh 100%         | US-0.4, US-2.1, US-2.2, US-2.3 |
| JTBD-02.2 | Track completion state visually at a glance     | STG-F: Persist (JRN-02.2)         | After page return, all completion states exactly as left — done tasks show strikethrough, pending tasks do not               | US-2.3, US-4.2       |
| JTBD-02.3 | Maintain clean list mid-day as priorities shift | STG-C: Enter (JRN-02.3)           | Input pinned at top — always visible without scrolling; new task added by keyboard alone in < 5 s                           | US-1.1, US-1.2       |
| JTBD-02.3 | Maintain clean list mid-day as priorities shift | STG-E: Clean (JRN-02.3)           | Stale task deleted in one click with no confirmation; combined add + delete completes in < 10 s with no page reload          | US-3.1, US-0.3       |

---

## Release Planning

### R1 — MVP: "Full Core Workflow" (All Stories)

**Theme:** Deliver the complete, trustworthy task management loop — capture, track, clean, persist — for both personas in a single release. All 20 stories are P0 (MVP-critical); no story can be deferred without breaking a core journey.

**Stories:** US-0.1 through US-4.5 (all 20)

**Personas served:** PER-01 Marcus Webb, PER-02 Priya Sharma

**JTBD addressed:** JTBD-01.1, JTBD-01.2, JTBD-01.3, JTBD-02.1, JTBD-02.2, JTBD-02.3

**Journey completeness:**

| Journey    | Scenario                              | Stories enabling it                          | Complete? |
|------------|---------------------------------------|----------------------------------------------|-----------|
| JRN-01.1   | First-time task capture               | US-0.2, US-1.1, US-1.2, US-4.3, US-0.3      | ✅ Yes    |
| JRN-01.2   | Quick mid-task capture and dismissal  | US-1.1, US-1.2, US-0.1, US-3.1, US-3.2      | ✅ Yes    |
| JRN-01.3   | Return to tab and trust saved tasks   | US-4.2, US-0.1, US-4.4, US-4.5              | ✅ Yes    |
| JRN-02.1   | Morning checklist construction        | US-1.2, US-0.3, US-4.1, US-4.2, US-0.1      | ✅ Yes    |
| JRN-02.2   | Mid-day progress tracking             | US-0.4, US-2.1, US-2.2, US-2.3, US-4.2      | ✅ Yes    |
| JRN-02.3   | Mid-day list hygiene                  | US-1.1, US-1.2, US-0.1, US-3.1, US-0.3      | ✅ Yes    |

**Per-stage delivery:**

| Stage           | Stories delivered in R1                               |
|-----------------|-------------------------------------------------------|
| STG-A: Arrive   | US-0.1, US-0.2, US-4.3                               |
| STG-B: Orient   | US-0.3                                                |
| STG-C: Enter    | US-1.1, US-1.2, US-1.3, US-1.4                       |
| STG-D: Track    | US-0.4, US-2.1, US-2.2, US-2.4                       |
| STG-E: Clean    | US-3.1, US-3.2, US-3.3                               |
| STG-F: Persist  | US-2.3, US-4.1, US-4.2, US-4.4, US-4.5              |

> **Rationale for single release:** This is an intentionally minimal product (frontend-only, no backend, no auth). All five features (F0–F4) are load-bearing — none can ship without the others. F4 (persistence) underlies every other feature. Splitting into two releases would ship a non-functional product.

---

## Coverage Analysis

### Persona Coverage

| Persona            | R1 Stories (primary) | R1 Stories (served) | All journeys covered? |
|--------------------|----------------------|---------------------|-----------------------|
| PER-01 Marcus Webb | US-0.2, US-1.1, US-1.3, US-1.4, US-3.1, US-3.2, US-3.3, US-4.3, US-4.4, US-4.5 | All 20 | ✅ Yes — JRN-01.1, 01.2, 01.3 |
| PER-02 Priya Sharma | US-0.1, US-0.3, US-0.4, US-1.2, US-2.1, US-2.2, US-2.3, US-2.4, US-4.1, US-4.2 | All 20 | ✅ Yes — JRN-02.1, 02.2, 02.3 |

### JTBD Coverage

| JTBD-ID   | Outcome                                         | Stories addressing it              | Covered? |
|-----------|-------------------------------------------------|------------------------------------|----------|
| JTBD-01.1 | Frictionless task capture — no login, no wait   | US-0.2, US-1.1, US-1.2, US-1.3, US-4.3 | ✅ Full |
| JTBD-01.2 | One-action task dismissal — no dialog           | US-3.1, US-3.2, US-3.3             | ✅ Full  |
| JTBD-01.3 | Reliable tab persistence — tasks always there   | US-0.1, US-4.1, US-4.2, US-4.4, US-4.5, US-1.4, US-2.4, US-3.3 | ✅ Full |
| JTBD-02.1 | Morning checklist via keyboard in < 60 s        | US-1.2, US-0.1, US-0.3, US-4.1, US-4.2 | ✅ Full |
| JTBD-02.2 | At-a-glance completion tracking; state persists | US-0.4, US-2.1, US-2.2, US-2.3, US-2.4, US-4.2 | ✅ Full |
| JTBD-02.3 | Mid-day list hygiene — add + delete in < 10 s   | US-1.1, US-1.2, US-3.1, US-0.3     | ✅ Full  |

### Gap Analysis

**Journey stages with no mapped stories:** None — all 6 stages have at least one story.

**JTBD outcomes with no NaC:** None — all 6 JTBD outcomes have at least one derived NaC.

**Orphan stories (not mapped to any journey stage):** None — all 20 stories are placed.

**Journey stages without a persistence safety net (F4):** None — every stage that mutates state (STG-C, STG-D, STG-E) has an F4 story (US-4.1) covering auto-save, plus error-handling stories (US-1.4, US-2.4, US-3.3) covering failure modes.

> **Known scope boundary (not a gap):** There are no R2/R3 stories because all PRD features are P0. Future v1.1 backlog items (due dates, cloud sync, undo) are explicitly out of scope and are not represented in this map.

---

## NaC-to-Acceptance-Criteria Alignment

Verifies that each NaC is substantiated by the formal Acceptance Criteria in the corresponding User Story.

| SM-ID  | NaC (testable criterion)                                                    | UserStory AC alignment                                                     | Aligned? |
|--------|-----------------------------------------------------------------------------|----------------------------------------------------------------------------|----------|
| SM-0.1 | All tasks render within 100 ms on page load; no user action required        | US-0.1 AC: "list renders within 100 ms of page load" ✓                    | ✅       |
| SM-0.2 | Empty-state prompt visible on first open; no login gate; no error           | US-0.2 AC: empty-state message shown; shown on first run without errors ✓  | ✅       |
| SM-0.3 | List updates in same event-loop tick on any mutation                        | US-0.3 AC: "new task row appears within the same event-loop tick" ✓        | ✅       |
| SM-0.4 | Done/pending split legible in < 5 s via strikethrough + muted style         | US-0.4 AC: strikethrough applied immediately; state matches stored boolean ✓| ✅       |
| SM-1.1 | Task appears on Enter/click; input clears + re-focuses immediately          | US-1.1 AC: "focus returns to input after submission" ✓                     | ✅       |
| SM-1.2 | Enter key submits; input clears + re-focuses; 8+ tasks in < 60 s feasible  | US-1.2 AC: "input cleared and focus is retained after Enter" ✓             | ✅       |
| SM-1.3 | Empty submit → no task created; validation message; input stays focused     | US-1.3 AC: "input field remains focused after a failed submission" ✓       | ✅       |
| SM-1.4 | Storage error → task rolled back; error banner shown; no silent data loss   | US-1.4 AC: "new task is rolled back from the in-memory list" ✓             | ✅       |
| SM-2.1 | Checkbox → strikethrough < 50 ms; saved to storage in same tick             | US-2.1 AC: "saved to local storage within the same event-loop tick" ✓      | ✅       |
| SM-2.2 | Uncheck → strikethrough removed immediately; `completed: false` persisted   | US-2.2 AC: "reverted completion state is saved to local storage immediately" ✓ | ✅  |
| SM-2.3 | After refresh, completed tasks show strikethrough; pending tasks do not     | US-2.3 AC: "every task's checkbox reflects the saved completed boolean" ✓  | ✅       |
| SM-2.4 | Storage error on toggle → checkbox reverts; banner shown; no inconsistency  | US-2.4 AC: "checkbox UI reverts to reflect the prior state" ✓              | ✅       |
| SM-3.1 | Delete → immediate removal, no confirmation dialog, < 50 ms                 | US-3.1 AC: "no confirmation dialog is shown before deletion" ✓             | ✅       |
| SM-3.2 | Last task deleted → empty-state message appears immediately                 | US-3.2 AC: "empty-state message appears immediately" ✓                     | ✅       |
| SM-3.3 | Storage error on delete → task re-inserted; banner shown; state consistent  | US-3.3 AC: "task is re-inserted at its original position" ✓                | ✅       |
| SM-4.1 | Every mutation auto-saves synchronously; no Save button; storage key current| US-4.1 AC: "save happens synchronously before DOM update is rendered" ✓    | ✅       |
| SM-4.2 | Full task array (titles + completion) restored on every page load           | US-4.2 AC: "full task array reconstructed and rendered from local storage" ✓| ✅      |
| SM-4.3 | First run → empty list + prompt, no errors, full functionality available    | US-4.3 AC: "loadTasks() returns [] with no errors logged to user" ✓        | ✅       |
| SM-4.4 | Corrupt JSON → cleared; valid tasks survive; no user-visible error          | US-4.4 AC: "corrupt key is removed; app starts fresh; no error to user" ✓  | ✅       |
| SM-4.5 | Storage blocked → session-only in-memory list; no error screen              | US-4.5 AC: "app functions as session-only in-memory list; no error banner" ✓| ✅      |

**All 20 NaC are substantiated by formal Acceptance Criteria. No misalignments detected.**

---

## Validation Checklist

- [x] Every UserStory (US-0.1 – US-4.5) appears in the map — **20/20 placed**
- [x] Every mapped story has a NaC derived from a specific JTBD outcome
- [x] NaC Derivation Table has full traceability chains (JTBD-ID → stage → NaC → story)
- [x] Release planning groups are defined — R1 contains all 20 stories
- [x] Coverage analysis identifies gaps — **no gaps, no orphans**
- [x] NaC-to-Acceptance Criteria mapping verifies alignment — **20/20 aligned**
- [x] Each release enables at least one complete journey — **R1 enables all 6 journeys**
- [x] No orphan stories — **all stories map to a journey stage**
- [x] No invented NaC — every NaC traces to a JTBD-ID

---

*STORY-MAP generated: 2026-05-08 | Model: claude-sonnet-4-6 | Source: PERSONAS-TodoApp.md + JTBD-TodoApp.md + JOURNEYS-TodoApp.md + UserStories-TodoApp.md + PRD-TodoApp.md*
