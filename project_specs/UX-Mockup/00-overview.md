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
