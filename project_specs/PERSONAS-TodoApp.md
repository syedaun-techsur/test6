# Personas — TodoApp

| Field          | Value                                          |
|----------------|------------------------------------------------|
| **Product**    | TodoApp — Basic To-Do App                      |
| **Version**    | 1.0                                            |
| **Date**       | 2026-05-08                                     |
| **Related PRD**| PRD-TodoApp.md                                 |
| **Status**     | Draft                                          |

---

## Persona Summary

| ID     | Name          | Role                    | Primary Goal                                              |
|--------|---------------|-------------------------|-----------------------------------------------------------|
| PER-01 | Marcus Webb   | Casual Jotter           | Quickly capture tasks without friction or sign-up overhead |
| PER-02 | Priya Sharma  | Daily Checklist Keeper  | Maintain a reliable personal task list throughout the day  |

---

## PER-01: Marcus Webb — Casual Jotter

**Role & Context:**
Marcus is a freelance graphic designer in his early 30s who works across multiple short-lived projects. He frequently finds himself mid-task needing to capture something quickly — a client note, a shopping errand, a follow-up call — before he forgets it. He uses a mix of devices (laptop, phone, work desktop) and jumps between apps constantly throughout his day. Marcus has tried Todoist, Notion, and even Apple Reminders, but consistently abandons them after a few days because they require accounts, load slowly, or bury the basic input field under menus. He does not need collaboration, reminders, or categories. He needs a blank page with a text box, available instantly, on any browser, without logging in.

**Goals:**
- Capture a task in under 5 seconds without any sign-up or onboarding friction (F1, PRD §3)
- See all his current tasks in one glance without navigating menus (F0)
- Trust that his tasks will still be there the next time he opens the tab (F4)
- Remove a task the moment it is done — fast, no confirmation prompt slowing him down (F3)

**Pain Points:**
- Existing tools require registration before a single task can be created (PRD §2)
- Feature-bloated interfaces (tags, projects, collaboration) overwhelm a simple use case (PRD §2)
- Apps that depend on network connectivity fail him when offline or on a spotty connection (PRD §2)
- Slow-loading apps break his focus during a busy workday (PRD §2)

**Technical Expertise:** Intermediate — comfortable with web apps and browsers; does not write code; avoids tools with steep learning curves.

**Top Tasks:**
1. Open the app and type a task immediately — no loading screen, no login (daily, critical)
2. Scan the task list at a glance to see what remains (multiple times daily, high)
3. Delete a completed task in one click without a confirmation dialog (daily, high)
4. Return to the same browser tab later and find all tasks intact (daily, critical)

**Success Criteria:**
- First task created in < 30 seconds from opening the app for the first time (PRD §7)
- Zero "lost task" incidents across normal browser use (page refresh, restart) (PRD §7)
- All CRUD interactions feel instantaneous — no perceptible delay (< 100 ms) (PRD §6, §7)

---

## PER-02: Priya Sharma — Daily Checklist Keeper

**Role & Context:**
Priya is a project coordinator at a mid-size consulting firm in her late 20s. She starts each workday by writing out a personal checklist of the 5–10 things she needs to get done, separate from her team's project-management tools (which she uses for shared work). This personal list is strictly for her own day-to-day tasks: attend a meeting, send a follow-up email, review a document, pick up lunch. She keeps TodoApp open as a pinned browser tab throughout her day and returns to it repeatedly to check off items or add new ones as priorities shift. Priya values visual clarity — she needs to see at a glance what is done vs. what is still pending. She does not need due dates or reminders; she just needs a clean, persistent checklist she can trust.

**Goals:**
- Build and maintain a daily personal checklist that persists across her entire workday without manual saving (F4, F1)
- Instantly distinguish completed tasks from pending ones using clear visual indicators (F2)
- Add new tasks quickly as they arise during meetings or calls (F1)
- Keep her list clean by removing items that are no longer relevant (F3)
- Access her list from any browser without re-entering data (F4)

**Pain Points:**
- Personal task tracking tools often mix personal tasks with shared team workflows, creating noise (PRD §2)
- Apps with heavy feature sets (reminders, tags, integrations) add cognitive overhead to a simple daily habit (PRD §2)
- Losing her checklist mid-day due to a browser refresh or crash disrupts her workflow (PRD §2)
- Slow or unreliable apps she cannot trust to be available offline break her routine (PRD §2)

**Technical Expertise:** Intermediate-to-high — uses web apps fluently all day; comfortable with keyboard shortcuts; does not need documentation to use a simple interface.

**Top Tasks:**
1. Add 5–10 tasks at the start of the day to build the day's checklist (daily morning, critical)
2. Check off completed tasks using the checkbox/toggle throughout the day (multiple times daily, critical)
3. Verify the task list is intact after switching browser tabs or returning from a meeting (daily, high)
4. Add a newly urgent task mid-day without interrupting current work (as-needed, high)
5. Delete stale or cancelled tasks to keep the list uncluttered (daily, medium)

**Success Criteria:**
- Completion state (checked/unchecked) for all tasks survives page refresh with 100% reliability (PRD §7)
- Visual distinction between completed and pending tasks is immediately clear without explanation (PRD §6 Usability)
- Full day's checklist operable via keyboard alone for power-user efficiency (PRD §6 Accessibility)

---

## Persona Relationships

| Interaction                        | PER-01 Marcus (Casual Jotter)     | PER-02 Priya (Daily Checklist Keeper) |
|------------------------------------|-----------------------------------|---------------------------------------|
| **Usage frequency**                | Sporadic — several bursts per day | Sustained — open all day              |
| **Session duration**               | Very short (< 1 min per session)  | Long (open continuously)              |
| **Task volume**                    | Low (1–5 tasks at a time)         | Moderate (5–10 tasks per day)         |
| **Completion tracking importance** | Low — deletes done tasks quickly  | High — visual done/pending status critical |
| **Persistence expectation**        | Basic — survives tab re-open      | Strong — survives full workday        |
| **Overlap**                        | Both need zero-friction task entry and reliable local persistence |

*These personas do not interact with each other — TodoApp is a single-user personal tool. The table above compares their behavioral patterns, not their collaboration.*

---

## Feature-Persona Matrix

| Feature ID | Feature Name              | PER-01 Marcus (Casual Jotter) | PER-02 Priya (Daily Checklist Keeper) |
|------------|---------------------------|-------------------------------|---------------------------------------|
| **F0**     | View Task List            | Primary                       | Primary                               |
| **F1**     | Add Task                  | Primary                       | Primary                               |
| **F2**     | Mark Task Complete        | Secondary                     | Primary                               |
| **F3**     | Delete Task               | Primary                       | Secondary                             |
| **F4**     | Local Storage Persistence | Primary                       | Primary                               |

**Legend:**
- **Primary** — Core workflow for this persona; feature directly addresses a key goal or pain point
- **Secondary** — Used by this persona but not their dominant interaction pattern

---

*PERSONAS generated: 2026-05-08 | Model: claude-sonnet-4-6 | Source: PRD-TodoApp.md | Next: JTBD-TodoApp.md*
