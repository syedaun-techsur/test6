---

## Accessibility Notes

**PRD requirement:** "Interactive elements (inputs, buttons, checkboxes) are keyboard-navigable and have appropriate ARIA labels."

---

### Colour Contrast

| Element | Requirement | Notes |
|---------|-------------|-------|
| Pending task title text | WCAG AA: min 4.5:1 contrast against background | Normal body text |
| Completed task title (muted/grey) | WCAG AA: min 4.5:1 even when muted | Don't use a grey that falls below 4.5:1 — e.g. `#767676` on white is the minimum passing grey |
| Error message text | WCAG AA: min 4.5:1 against background | Red error text must not be too light |
| Error banner text | WCAG AA: min 4.5:1 | Amber/orange banners require dark text (not white) |
| "Add Task" button label | WCAG AA: min 4.5:1 (text on button background) | Standard button contrast |
| Empty-state message | WCAG AA: min 4.5:1 | Even tertiary/muted copy must pass |

**Note on completion styling:** Strikethrough text communicates completion visually — ensure this is **not the only indicator** for users who cannot perceive text decoration. The checked checkbox state is the semantic indicator; the muted colour is supplementary. Both together ensure multiple redundant cues.

---

### Keyboard Navigation

| Action | Keyboard Interaction |
|--------|---------------------|
| Focus task input on load | Input autofocused on `DOMContentLoaded` — user can type immediately |
| Submit task | `Enter` key while input is focused (US-1.2) |
| Tab through task rows | `Tab` key moves focus: input → Add button → checkbox (row 1) → delete (row 1) → checkbox (row 2) → ... |
| Toggle completion | `Space` key on focused checkbox (native checkbox behaviour) |
| Delete task | `Enter` or `Space` on focused delete button |
| Dismiss error banner | `Enter` or `Space` on focused `[✕]` dismiss button; or `Tab` past it |

**Focus management:**
- After successful task submission: focus **returns to input** (US-1.1, US-1.2).
- After failed (empty) submission: focus **stays on input** (US-1.3).
- After delete: focus behaviour — if the deleted row had focus, move focus to the next row's checkbox or, if the list is now empty, to the input field.
- Error banner: does not steal focus when it appears (it uses `role="alert"` which announces via screen reader without moving keyboard focus).

---

### Screen Reader Support

| Element | ARIA / Semantic Markup | Notes |
|---------|------------------------|-------|
| App heading | `<h1>TodoApp</h1>` | Single page-level heading |
| Add form | `<form>` with `<label for="task-input">` | Associates label with input semantically |
| Task input | `<input type="text" id="task-input" aria-label="New task title">` | Label or aria-label required |
| Add button | `<button type="submit">Add Task</button>` | Descriptive text; no icon-only button |
| Validation error | `<span role="alert" aria-live="polite">` below input | Announced when it appears; `polite` avoids interrupting in-progress speech |
| Task list | `<ul>` or `<ol>` | Semantic list; screen reader announces item count |
| Task row | `<li>` | Each task is a list item |
| Checkbox | `<input type="checkbox" aria-label="Mark '{title}' as complete">` | Dynamic label includes task title for context |
| Delete button | `<button aria-label="Delete task: {title}">` (or at minimum `aria-label="Delete task"`) | Without a label, a trash icon is meaningless to screen readers (US-3.1 specifies `aria-label="Delete task"`) |
| Error banner | `<div role="alert" aria-live="assertive">` | `assertive` interrupts screen reader to announce storage errors immediately |
| Dismiss button | `<button aria-label="Dismiss error">✕</button>` | Icon must have accessible label |
| Empty state | `<p>` or `<div>` with visible text | No ARIA needed; plain text is sufficient |

---

### Focus Indicators

- All interactive elements must have a **visible focus ring** — do not suppress `outline: none` without providing a custom equivalent
- Focus ring should have sufficient contrast: WCAG 2.1 SC 1.4.11 (Non-Text Contrast) requires 3:1 minimum
- Custom focus styles should be additive: `outline` + optional box-shadow for extra visibility

---

### Motion / Animation

- Any append animation on new tasks (e.g., subtle fade-in or slide-in) must respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation: none; transition: none; }
  }
  ```
- The core interactions (add, toggle, delete) are instant — no animation is required; any animation is purely cosmetic and must not delay the visual state change

---

### Touch / Pointer

- Minimum touch target: **44 × 44 px** for checkbox and delete button (WCAG 2.5.5)
- Touch targets must not overlap — sufficient spacing between checkbox and delete button within each row
- No hover-dependent interactions for task management — delete must be always visible or revealed on tap, not only on mouse hover

---

*UX-Mockup generated: 2026-05-08 | Based on: UserStories-TodoApp.md, JOURNEYS-TodoApp.md, PRD-TodoApp.md, FRD-TodoApp.md*
