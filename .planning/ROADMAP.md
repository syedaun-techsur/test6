# Roadmap: Basic To-Do App

## Overview

Two phases deliver a complete, working to-do app. Phase 1 scaffolds the project and delivers a working UI that can display tasks — the read path. Phase 2 wires in the full CRUD operations (add, complete, delete) with localStorage persistence, making every user action functional and durable.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Task Display** - Project scaffolded; task list renders from localStorage on load
- [x] **Phase 2: Full CRUD & Persistence** - Add, complete, and delete tasks with auto-save to localStorage

## Phase Details

### Phase 1: Foundation & Task Display
**Status**: completed (2026-05-29)
**Last Updated**: 2026-05-29T16:30:07Z
**Goal**: A working static app exists in the browser — users can open it and see their task list (or an empty-state prompt)
**Depends on**: Nothing (first phase)
**Requirements**: F0
**Success Criteria** (what must be TRUE):
  1. Opening the app in a browser shows either a list of existing tasks or an empty-state message ("No tasks yet — add one above!")
  2. Each task in the list displays its title and a visual indicator of whether it is complete (checkbox + strikethrough)
  3. The app shell (HTML, CSS, JS modules, build tooling) exists and can be served as static files
  4. Reloading the page re-renders the same list from localStorage without data loss
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — HTML scaffold + CSS styling (app shell)
- [x] 01-02-PLAN.md — JS modules: storage, renderer, entry point wiring

### Phase 2: Full CRUD & Persistence
**Status**: executing
**Last Updated**: 2026-05-29T00:00:00Z
**Goal**: Users can add, complete, and delete tasks — every action is reflected immediately in the UI and persisted automatically to localStorage
**Depends on**: Phase 1
**Requirements**: F1, F2, F3, F4
**Success Criteria** (what must be TRUE):
  1. User can type a task title and submit (button click or Enter) to see the task appear at the bottom of the list instantly
  2. Submitting an empty or whitespace-only title shows an inline validation message and creates no task
  3. User can click a task's checkbox to toggle it complete/incomplete — the title gains or loses strikethrough immediately
  4. User can click a task's delete button to permanently remove it from the list instantly (no confirmation dialog)
  5. After any add, complete/uncomplete, or delete action, a page refresh restores the exact same task list state
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Enable input area + add task handler (F1 + F4 write)
- [x] 02-02-PLAN.md — Toggle complete + delete task + event delegation (F2 + F3 + F4)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Task Display | 2/2 | ✓ Complete | 2026-05-15 |
| 2. Full CRUD & Persistence | 2/2 | ✓ Complete | 2026-05-29 |