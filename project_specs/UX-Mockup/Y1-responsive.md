---

## Responsive Considerations

TodoApp is a single-column, vertically-stacked layout. Responsive design is straightforward — no major layout restructuring is needed across breakpoints.

**PRD constraint:** "Usable on mobile screen widths (≥ 320 px) and desktop widths; layout adapts without horizontal scroll."

---

### Desktop (> 768 px)

```
┌────────────────────────────────────────────────────┐
│              TodoApp                               │
│         Personal Task List                        │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  [___ What needs to be done? ____________]   │  │
│  │                          [  Add Task  ▶  ]   │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ ☐  Review proposal – EOD              [🗑]   │  │
│  ├──────────────────────────────────────────────┤  │
│  │ ☑  ~~Buy groceries~~                  [🗑]   │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
  Max content width: ~600–700 px, centered on wide screens
```

- Content area capped at ~600–700 px max-width, centered with auto margins
- Input field and button sit comfortably inline on the same row
- Task rows have generous horizontal padding
- Delete button visible on hover (desktop) or always visible (simpler approach)
- Adequate vertical spacing between task rows (min 44 px touch target, even on desktop for consistency)

---

### Tablet (481 px – 768 px)

- Same single-column layout as desktop
- Max-width constraint relaxed or removed (full-width with padding)
- Input + button remain inline on the same row — sufficient horizontal space
- Touch targets: checkbox and delete button minimum 44 × 44 px
- Delete button: consider **always visible** rather than hover-only (touch has no hover state)

---

### Mobile (320 px – 480 px)

```
┌──────────────────────────────┐
│        TodoApp               │
│     Personal Task List       │
│                              │
│  ┌──────────────────────┐    │
│  │ What needs doing?    │    │  ← input, full width
│  └──────────────────────┘    │
│  ┌──────────────────────┐    │
│  │     Add Task ▶       │    │  ← button, full width below input
│  └──────────────────────┘    │
│                              │
│  ☐  Review proposal – EOD  🗑│  ← row compressed
│  ────────────────────────────│
│  ☑  ~~Buy groceries~~      🗑│
│  ────────────────────────────│
└──────────────────────────────┘
```

**Key mobile adjustments:**
- Add button stacks **below** the text input (full-width block button) when inline layout is too cramped (< ~380 px)
- Input field is full-width
- Task title text wraps to a second line for long titles — row height expands; delete button aligns to top-right of row
- Checkbox and delete icon: minimum 44 × 44 px tap target (WCAG 2.5.5 AAA; 24 × 24 minimum for AA)
- Delete button: **always visible** — no hover dependency on touch devices
- Inline validation error: wraps cleanly below the input, full width
- Error banner: full-width, text wraps as needed; dismiss `[✕]` button touch-friendly

**No horizontal scroll:** Single-column layout with percentage/fluid widths and adequate padding guarantees no overflow at ≥ 320 px.

---

### Viewport Overflow (Long Lists)

- Task list container is a scrollable region (`overflow-y: auto`)
- Add form is **sticky/pinned** at the top — it does not scroll out of view
- On mobile, the sticky add form may use `position: sticky; top: 0` with a background to prevent the list bleeding through
- Scrollbar visible on desktop when list overflows viewport height

---
