# User Journey Maps — TodoApp

| Field               | Value                                                        |
|---------------------|--------------------------------------------------------------|
| **Product**         | TodoApp — Basic To-Do App                                    |
| **Version**         | 1.0                                                          |
| **Date**            | 2026-05-08                                                   |
| **Related Personas**| PERSONAS-TodoApp.md (PER-01, PER-02)                         |
| **Related JTBD**    | JTBD-TodoApp.md (JTBD-01.1–01.3, JTBD-02.1–02.3)            |
| **Related PRD**     | PRD-TodoApp.md (F0–F4)                                       |
| **Status**          | Draft                                                        |

---

## Journey Index

| JRN-ID    | Persona              | Scenario                                        | Key JTBD                     | Stages |
|-----------|----------------------|-------------------------------------------------|------------------------------|--------|
| JRN-01.1  | PER-01 Marcus Webb   | First-time task capture (brand new user)        | JTBD-01.1                    | 5      |
| JRN-01.2  | PER-01 Marcus Webb   | Quick mid-task capture and dismissal            | JTBD-01.1, JTBD-01.2         | 5      |
| JRN-01.3  | PER-01 Marcus Webb   | Returning to a tab and trusting saved tasks     | JTBD-01.3                    | 4      |
| JRN-02.1  | PER-02 Priya Sharma  | Morning checklist construction                  | JTBD-02.1                    | 5      |
| JRN-02.2  | PER-02 Priya Sharma  | Mid-day progress tracking and re-orientation    | JTBD-02.2                    | 5      |
| JRN-02.3  | PER-02 Priya Sharma  | Mid-day list hygiene — add urgent, delete stale | JTBD-02.3                    | 4      |

---

## PER-01: Marcus Webb — Casual Jotter

---

### JRN-01.1: First-Time Task Capture

**Persona:** PER-01 (Marcus Webb)

**Scenario:** Marcus is in the middle of a client project and a follow-up action suddenly surfaces in his mind. A colleague just told him about TodoApp. He opens it in a new browser tab for the first time, with no prior context, and needs to get his thought captured before he loses it. This is his only chance to evaluate the app — if it slows him down, he'll close the tab and go back to his Notes app.

**Related Jobs:** JTBD-01.1

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Arrive** | Pastes URL into new browser tab, hits Enter | Browser URL bar → App load | "Please just load fast — I have 30 seconds before my next thing" | Impatient, cautious | Any splash screen, loading spinner, or login prompt will cause immediate abandonment | Sub-second paint of input field; no interstitial screens whatsoever |
| **2. Orient** | Scans the page to understand what's here | App home screen (F0) | "OK — input box at top, list below. I think I just type here?" | Tentatively curious | If the input field isn't visually obvious and already focused, he hesitates and second-guesses | Auto-focus cursor in input on load; minimal chrome so input is unmistakably the primary action |
| **3. Type & Submit** | Types task title, presses Enter | Add Task input (F1) | "Did it work? I don't see a save button..." | Uncertain, watching | No visual feedback between typing and submission can feel broken | Task appears in list instantly on Enter; input clears and re-focuses without any visible delay |
| **4. Confirm** | Sees task appear in list below input | Task list (F0, F4) | "Oh — there it is. That actually worked." | Relieved, pleasantly surprised | If the task doesn't appear within ~500 ms, trust is broken | Smooth append animation draws eye to the newly added item |
| **5. Return to work** | Switches back to client project tab | Browser tab bar | "Good. That's stored. I can deal with it later." | Satisfied, focused | Worries it will be gone later (residual mistrust from past app experiences) | Empty-state copy + first-task experience that signals "your data is saved here" builds trust immediately |

#### Key Moments

- **Decision Point — Stage 1 (Arrive):** If the page shows any gate (login, welcome modal, onboarding wizard) Marcus closes the tab. This is a hard drop-off risk.
- **Risk of Abandonment — Stage 3 (Type & Submit):** Any ambiguity about how to submit ("do I click a button or press Enter?") erodes confidence. Two-path submission (both Enter and button) removes hesitation.
- **Delight Opportunity — Stage 4 (Confirm):** The instant, friction-free appearance of the task is the "aha moment." A subtle animation turns a functional event into a satisfying one.

#### Success Outcome

Marcus creates his first task in under 30 seconds from opening the URL — with zero instructions, zero account prompts (JTBD-01.1 success measure: first task in < 30 s).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Arrive | F0 (View Task List — initial render) |
| Orient | F0 (View Task List), F1 (Add Task — visual focus) |
| Type & Submit | F1 (Add Task), F4 (Local Storage Persistence) |
| Confirm | F0 (View Task List), F4 (Local Storage Persistence) |
| Return to work | F4 (Local Storage Persistence — implicit trust) |

---

### JRN-01.2: Quick Mid-Task Capture and Dismissal

**Persona:** PER-01 (Marcus Webb)

**Scenario:** Marcus already has a few tasks in his list from earlier. He's working on a design brief when he remembers he needs to call his accountant. He flips to the TodoApp tab, adds the task in seconds, and then notices a task he finished this morning ("Send invoice to client") that's still cluttering his list. He deletes it without ceremony and gets back to the design brief. Total time away from his work: under 15 seconds.

**Related Jobs:** JTBD-01.1, JTBD-01.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Switch Tab** | Clicks TodoApp pinned tab | Browser tab bar | "Quick — add the accountant call before I forget it" | Focused, slightly rushed | If the tab has unloaded and needs to re-render, he loses the mental context for why he came here | Tab restores instantly; list is already visible |
| **2. Type & Submit** | Types "Call accountant – Thursday" and presses Enter | Add Task input (F1) | "Enter to submit, right? Yeah." | Confident (familiar from first use) | None at this stage — he's already learned the interaction | Input clears immediately and re-focuses so he could add another if needed |
| **3. Scan List** | Eyes drop to the task list | Task list (F0) | "Good, it's there. Oh — I can delete that invoice one now." | Efficient, slightly relieved | A long list with no urgency signals makes spotting the done item slower | Tasks stay in insertion order; completed tasks could appear visually muted for quick scanning |
| **4. Delete Stale Task** | Clicks delete icon on "Send invoice" task | Delete button (F3) | "Gone. Good." | Satisfied | A confirmation dialog here would be deeply annoying — he knows what he's doing | Immediate removal with no modal; subtle fade-out animation acknowledges the action |
| **5. Return to Work** | Switches back to design brief tab | Browser tab bar | "Clean list. Back to it." | Calm, uninterrupted | None | List state preserved exactly for next return visit |

#### Key Moments

- **Decision Point — Stage 3 (Scan List):** Marcus decides on the spot to also clean up a stale task. If delete is discoverable (visible icon on hover or always-on), this opportunistic cleanup happens. If delete is hidden behind a menu or swipe gesture, it doesn't.
- **Risk of Abandonment — Stage 4 (Delete):** A confirmation dialog ("Are you sure?") at this stage contradicts the entire value proposition. It would train Marcus not to use the delete feature.
- **Delight Opportunity — Stage 2 (Type & Submit):** Re-focus of input after Enter means he could rattle off two tasks back-to-back without touching the mouse — feels fast and responsive.

#### Success Outcome

Marcus removes a stale task in a single click with no confirmation dialog; the list updates immediately (JTBD-01.2 success measure: task removed in < 3 s from decision to cleared screen).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Switch Tab | F0 (View Task List), F4 (Local Storage Persistence) |
| Type & Submit | F1 (Add Task), F4 (Local Storage Persistence) |
| Scan List | F0 (View Task List) |
| Delete Stale Task | F3 (Delete Task), F4 (Local Storage Persistence) |
| Return to Work | F0 (View Task List) |

---

### JRN-01.3: Returning to a Tab and Trusting Saved Tasks

**Persona:** PER-01 (Marcus Webb)

**Scenario:** Marcus added three tasks mid-morning, then spent two hours in back-to-back video calls with his laptop lid closed. When he reopens his laptop and his browser restores the previous session, he clicks the TodoApp tab expecting to find his tasks. If they're gone, he loses trust in the app permanently. This journey is about the silent guarantee the app must keep.

**Related Jobs:** JTBD-01.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Reopen Browser** | Opens laptop lid; browser session restores | OS / Browser session restore | "Let me check what I still have to do" | Neutral, slightly hopeful | Some apps show a blank state after a long gap or browser restore; this is a betrayal moment | Local storage read happens before first paint — tasks are there when the screen appears |
| **2. Click Tab** | Navigates to TodoApp tab | Browser tab bar | "Please be there..." | Mildly anxious (learned helplessness from prior app experiences) | If the tab shows a loading state longer than ~300 ms, anxiety spikes | Instant render from local storage — no network dependency |
| **3. Verify List** | Scans task list; confirms all 3 tasks are present with correct titles | Task list (F0, F4) | "Yes — accountant call, design revision, grocery run. All there." | Relieved, trusting | Any missing task or wrong order is a trust-breaker; even one lost task ends the relationship | Stable insertion-order list makes verification fast; no sorting surprises |
| **4. Continue Work** | Picks the most urgent task and acts on it | Task list (F0) | "Right — accountant call first. Let me do that now." | Focused, confident in the tool | None at this stage | The reliable persistence transforms the app from a "try once" to a "daily habit" tool |

#### Key Moments

- **Decision Point — Stage 3 (Verify List):** Marcus either trusts the app and adds it to his daily workflow, or loses faith and abandons it. This is the highest-stakes moment in his entire relationship with the product.
- **Risk of Abandonment — Stage 2 (Click Tab):** Any loading indicator or missing-data state here ends the trial. Persistence must be invisible and instant.
- **Delight Opportunity — Stage 3 (Verify List):** The quiet confidence of "it's all there" is more powerful than any feature. Building emotional trust through reliability is the core value.

#### Success Outcome

All tasks are present after browser restore and page reloads — zero data-loss incidents across refresh and restart cycles (JTBD-01.3 success measure: 100% persistence reliability across 20 refreshes and 2 restarts).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Reopen Browser | F4 (Local Storage Persistence — auto-load) |
| Click Tab | F0 (View Task List), F4 (Local Storage Persistence) |
| Verify List | F0 (View Task List), F4 (Local Storage Persistence) |
| Continue Work | F0 (View Task List) |

---

## PER-02: Priya Sharma — Daily Checklist Keeper

---

### JRN-02.1: Morning Checklist Construction

**Persona:** PER-02 (Priya Sharma)

**Scenario:** It's 8:45 AM. Priya sits down at her desk, opens her pinned TodoApp tab, and begins building her day's personal checklist before her 9:00 AM standup. She has 8–10 tasks to enter — all from memory, all keyboard-first. She needs to move fast, without the app fighting her. If she has to reach for the mouse between each task, the flow breaks. She should be done building her list in under 60 seconds.

**Related Jobs:** JTBD-02.1

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Open App** | Clicks pinned TodoApp browser tab | Browser tab → App home (F0) | "Quick — I have 10 minutes before standup" | Focused, slightly rushed | Residual anxiety from past app experiences losing data; wants to confirm list is still empty (fresh day) | Show empty-state prompt that signals readiness: "What do you need to do today?" |
| **2. First Task Entry** | Types first task, presses Enter | Add Task input (F1) | "Does it re-focus after Enter? Please re-focus." | Tentative on first item | If input loses focus after submission, she must click or Tab back — kills her rhythm entirely | Auto-focus input after every Enter submission; cursor returns instantly |
| **3. Rapid Batch Entry** | Types 7 more tasks in rapid succession, Enter after each | Add Task input (F1), Task list (F0) | "Keep going — attend standup, send status email, review contract, book room…" | Rhythmic, in flow | Any lag between submissions (> 100 ms) breaks the typing cadence and feels buggy | Instant list append with no debounce delay; input clears and re-focuses in < 50 ms |
| **4. Scan Completed List** | Scrolls or glances down at all 8 tasks | Task list (F0) | "Good. All there, in the right order. I can start the day." | Satisfied, grounded | Tasks appearing out-of-order or with duplicates from accidental double-Enter would require cleanup | Maintain insertion order; disable submit on empty string to prevent phantom tasks |
| **5. Close and Start Day** | Minimises window to join standup | Browser / OS task management | "It'll be there when I get back." | Confident, calm | Worry that task list might not survive the meeting gap (tab unloads on some browsers) | Local storage guarantees persistence even if browser tab unloads during the meeting |

#### Key Moments

- **Decision Point — Stage 2 (First Task Entry):** If auto-focus after Enter doesn't work, Priya's keyboard-only flow is broken immediately. This is a make-or-break interaction at the very start of her workflow.
- **Risk of Abandonment — Stage 3 (Rapid Batch Entry):** Any perceptible lag during rapid entry trains Priya to slow down and double-check each submission — turning a 60-second habit into a 3-minute chore.
- **Delight Opportunity — Stage 4 (Scan Completed List):** Seeing a clean, complete checklist of everything she needs to do today — captured in under a minute — is the core satisfaction moment of her daily routine.

#### Success Outcome

Priya enters 8 tasks via keyboard in under 60 seconds, with each appearing instantly and all persisting after she returns from her meeting (JTBD-02.1 success measure: 8 tasks entered keyboard-only in < 60 s).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Open App | F0 (View Task List — empty state) |
| First Task Entry | F1 (Add Task), F4 (Local Storage Persistence) |
| Rapid Batch Entry | F1 (Add Task), F0 (View Task List), F4 (Local Storage Persistence) |
| Scan Completed List | F0 (View Task List) |
| Close and Start Day | F4 (Local Storage Persistence — implicit guarantee) |

---

### JRN-02.2: Mid-Day Progress Tracking and Re-Orientation

**Persona:** PER-02 (Priya Sharma)

**Scenario:** It's 1:15 PM. Priya returns to her desk after a long lunchtime call that ran over. She has a full afternoon ahead and needs to quickly reorient: What did she finish this morning? What's still pending? She glances at her TodoApp list and starts checking off what she completed during the morning before she noticed, then scans the remaining items to decide what to tackle next. The visual state of the list must tell the story without her having to re-read every item.

**Related Jobs:** JTBD-02.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Return to Tab** | Clicks TodoApp tab | Browser tab, Task list (F0, F4) | "What did I finish and what's left?" | Slightly disoriented after the long call | If completion states were lost during the absence, she must mentally reconstruct her morning — high cognitive load | All completion states restored from local storage exactly as she left them |
| **2. Scan for Done/Pending Split** | Visually scans list for checked vs. unchecked items | Task list (F0, F2) | "Ok — standup done, email done. Contract review still pending. Budget call still pending." | Reorienting, becoming focused | If completed and pending tasks look identical, she must read every item title — slow and error-prone | Strikethrough + muted colour on completed items makes done/pending split legible in 2–3 seconds |
| **3. Check Off Morning Completions** | Clicks checkbox on 3 tasks she finished but hadn't marked | Checkbox toggle (F2), Task list (F0) | "Standup — done. Status email — done. Oh and I reviewed that contract on my phone — done." | Methodical, efficient | If the checkbox is too small or hit area is too tight, she misclicks and accidentally marks the wrong task | Large click target for checkbox; immediate visual toggle on click with state saved to local storage |
| **4. Re-verify After Toggle** | Glances at list after marking tasks done | Task list (F0, F4) | "Good — 3 done, 5 still to go. Afternoon plan: budget call first." | Focused, in control | If the toggle animation is slow or the strikethrough appears after a delay, the feedback loop feels broken | Instant visual state change (< 50 ms) on toggle; state written to local storage synchronously |
| **5. Decide Next Action** | Identifies first unchecked item and starts work | Task list (F0) | "Budget call is first. Let me dial in." | Purposeful, calm | None — the list has done its job | Clean visual hierarchy (pending items prominent, done items subdued) lets the "next action" self-select |

#### Key Moments

- **Decision Point — Stage 2 (Scan for Done/Pending Split):** If the visual distinction is not immediately obvious, Priya re-reads every item — the core value of the checklist collapses into a reading exercise.
- **Risk of Abandonment — Stage 1 (Return to Tab):** If completion states were lost during the break, Priya's confidence in the tool is shaken. One incident of state loss and she reverts to paper or a shared tool.
- **Delight Opportunity — Stage 5 (Decide Next Action):** A well-structured list where pending items visually jump out — without any configuration — is the "invisible design win" that keeps Priya returning every day.

#### Success Outcome

Priya identifies all pending vs. done tasks in a list of 10 mixed-state items in under 5 seconds; completion state survives the page return with 100% accuracy (JTBD-02.2 success measure).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Return to Tab | F0 (View Task List), F4 (Local Storage Persistence) |
| Scan for Done/Pending | F0 (View Task List), F2 (Mark Task Complete — visual state) |
| Check Off Completions | F2 (Mark Task Complete), F0 (View Task List), F4 (Local Storage Persistence) |
| Re-verify After Toggle | F0 (View Task List), F4 (Local Storage Persistence) |
| Decide Next Action | F0 (View Task List) |

---

### JRN-02.3: Mid-Day List Hygiene — Add Urgent, Delete Stale

**Persona:** PER-02 (Priya Sharma)

**Scenario:** It's 3:00 PM. During a Slack conversation, Priya's manager asks her to review a proposal before end of day — an unplanned task that just jumped to the top of her priority list. At the same time, a meeting she had scheduled ("Book conference room") was cancelled by someone else, making that task irrelevant. Without leaving her Slack window for more than a moment, Priya needs to add the new urgent task and delete the stale one. Both actions should take under 10 seconds total.

**Related Jobs:** JTBD-02.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Switch to Tab** | Alt-tabs to TodoApp browser tab | Browser tab switcher | "Quick update — add proposal review, delete conference room task" | Efficient, slightly task-switching overhead | If the input field is not visible without scrolling (long list has pushed it below the fold), she must scroll before she can type | Input field pinned to top of viewport regardless of list length — always reachable |
| **2. Add Urgent Task** | Types "Review proposal – EOD" and presses Enter | Add Task input (F1) | "Enter. Done. Now delete the room booking." | Focused | None if auto-focus works as expected from the morning | New task appended instantly; input re-focuses for potential follow-up entry |
| **3. Locate Stale Task** | Scans list for "Book conference room" | Task list (F0) | "Where is that room booking task... there." | Scanning, efficient | A long list with no visual hierarchy makes target acquisition slower | Insertion-order list is predictable; she knows roughly where she added it |
| **4. Delete Stale Task** | Clicks delete icon on "Book conference room" | Delete button (F3), Task list (F0), F4 | "Gone." | Satisfied | Any confirmation modal here would be jarring given her mental state (split attention between Slack and TodoApp) | Immediate, no-confirm deletion; task fades out or instantly disappears |

#### Key Moments

- **Decision Point — Stage 1 (Switch to Tab):** If the input field requires scrolling to reach, the time cost of the action increases enough that Priya might defer adding the task — and then forget it entirely.
- **Risk of Abandonment — Stage 4 (Delete):** A confirmation dialog at this moment interrupts a context switch that already has cognitive overhead. It would cause Priya to perceive the app as slower and higher-friction than her mental model of it.
- **Delight Opportunity — Stage 2 + 4 (Add + Delete in sequence):** Completing both tasks in under 10 seconds without scrolling or mouse navigation delivers the "surgical efficiency" that makes a power user fall in love with a tool.

#### Success Outcome

Priya adds one new task and removes one stale task in under 10 seconds total, without scrolling or leaving her current context (JTBD-02.3 success measure).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Switch to Tab | F0 (View Task List), F1 (Add Task — visibility) |
| Add Urgent Task | F1 (Add Task), F4 (Local Storage Persistence) |
| Locate Stale Task | F0 (View Task List) |
| Delete Stale Task | F3 (Delete Task), F0 (View Task List), F4 (Local Storage Persistence) |

---

## Cross-Journey Patterns

### Shared Pain Points (appear in 3+ journeys)

- **Auto-focus after submission (F1):** Affects JRN-01.1, JRN-01.2, JRN-02.1, JRN-02.3. Every journey involving task entry depends on the input re-focusing after Enter. This is not a nice-to-have — it is the keystone of the fast-entry experience for both personas.
- **Instant UI response (< 50 ms) on all mutations:** Affects all 6 journeys. Perceived lag on add, toggle, or delete is the most broadly shared pain point. The app must feel synchronous even though local storage writes are technically asynchronous.
- **No confirmation dialogs on delete (F3):** Affects JRN-01.2, JRN-02.3. Both personas are in a split-attention or time-pressured state when they delete. A confirmation dialog is the single interaction most likely to train users away from using the delete feature.
- **Local storage persistence as silent guarantee (F4):** Affects JRN-01.3, JRN-02.1, JRN-02.2. Both personas treat persistence as a baseline expectation, not a feature. Any visible failure — missing tasks, lost completion state — is a trust-ending event.

### Shared Opportunities

- **Input always above the fold:** Both personas (JRN-02.3, JRN-01.1, JRN-02.1) need to add a task without scrolling. Pinning the input field to the top of the viewport addresses this for all use cases.
- **Visible delete affordance (always-on vs. hover):** Marcus discovers delete opportunistically (JRN-01.2); Priya targets it deliberately (JRN-02.3). An always-visible or consistently hover-revealed delete icon serves both patterns without imposing visual noise at rest.
- **Empty-state as onboarding:** JRN-01.1 and JRN-02.1 both involve seeing the empty state first. A short, action-prompting empty-state message ("Add your first task above") replaces any onboarding flow for both personas simultaneously.

### Persona Divergence Points

| Pattern | PER-01 Marcus (Casual Jotter) | PER-02 Priya (Daily Checklist Keeper) |
|---------|-------------------------------|---------------------------------------|
| **Completion toggle (F2)** | Secondary — he deletes done tasks rather than checking them off | Primary — strikethrough/muted styling is her main visual signal all day |
| **Session duration** | < 1 minute per visit; 3–5 visits per day | Open continuously; 8+ hours per day |
| **Recovery from lost state** | Frustrating but recoverable — list is short | Day-breaking — she has no fallback for her full personal checklist |
| **Keyboard fluency** | Comfortable but not mandatory | Power-user — keyboard-only workflow is explicitly required |

---

## Journey-to-JTBD Traceability

| JRN-ID   | Stage                  | JTBD-ID   | Expected Outcome                                                                      |
|----------|------------------------|-----------|--------------------------------------------------------------------------------------|
| JRN-01.1 | Type & Submit          | JTBD-01.1 | First task created in < 30 s with no login or onboarding gate                        |
| JRN-01.1 | Confirm                | JTBD-01.1 | Task appears in list and is saved within 1 second of pressing Enter                  |
| JRN-01.2 | Type & Submit          | JTBD-01.1 | Returning user captures task in < 5 s; input re-focuses automatically                |
| JRN-01.2 | Delete Stale Task      | JTBD-01.2 | Task removed in single click with no confirmation dialog; list updates immediately    |
| JRN-01.3 | Verify List            | JTBD-01.3 | All tasks present after browser restore; zero data-loss across refreshes and restarts |
| JRN-02.1 | Rapid Batch Entry      | JTBD-02.1 | 8 tasks entered via keyboard in < 60 s; each appears instantly; all persist           |
| JRN-02.1 | Scan Completed List    | JTBD-02.1 | All tasks in insertion order; no duplicates; input disabled on empty submit           |
| JRN-02.2 | Scan for Done/Pending  | JTBD-02.2 | Done/pending split legible in < 5 s via strikethrough + muted colour                 |
| JRN-02.2 | Check Off Completions  | JTBD-02.2 | Toggle takes effect immediately; state saved to local storage synchronously           |
| JRN-02.2 | Return to Tab          | JTBD-02.2 | Completion state survives page return with 100% accuracy                              |
| JRN-02.3 | Add Urgent Task        | JTBD-02.3 | New task added in single keyboard action; input always visible without scrolling      |
| JRN-02.3 | Delete Stale Task      | JTBD-02.3 | Stale task deleted in single click with no confirmation; add + delete < 10 s total   |

---

*JOURNEYS generated: 2026-05-08 | Model: claude-sonnet-4-6 | Source: PERSONAS-TodoApp.md + JTBD-TodoApp.md + PRD-TodoApp.md | Next: STORY-MAP-TodoApp.md*
