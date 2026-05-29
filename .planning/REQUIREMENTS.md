# Requirements: Basic To-Do App

**Defined:** 2026-05-08
**Core Value:** Users can reliably add, complete, and remove tasks from their personal list.

## v1 Requirements

### Task List

- [x] **F0**: User can view all tasks in a list with completion status indicators

### Task Creation

- [x] **F1**: User can add a new task by typing a title and submitting (button click or Enter key)

### Task Completion

- [x] **F2**: User can mark a task as complete/incomplete via checkbox toggle

### Task Deletion

- [x] **F3**: User can delete a task permanently with a single click (no confirmation dialog)

### Persistence

- [x] **F4**: Tasks persist across page refresh via browser localStorage (auto-save on every mutation, auto-load on page start)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

*(None at this time — all core requirements are v1)*

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / authentication | Single-user personal tool for v1 |
| Task categories / tags | Keep it simple, not needed for basic use case |
| Due dates / reminders | Out of minimal scope |
| Collaboration / sharing | Single-user scope |
| Mobile app | Web-first; mobile is future |
| Real-time sync | No backend for v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| F0 | Phase 1 | Complete |
| F1 | Phase 2 | Complete |
| F2 | Phase 2 | Complete |
| F3 | Phase 2 | Complete |
| F4 | Phase 2 | Complete |

**Coverage:**
- v1 requirements: 5 total
- Mapped to phases: 5
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-08*
*Last updated: 2026-05-08 — corrected F1–F4 from v2 to v1 (all are P0 MVP per PRD/FRD); traceability mapped to phases*
