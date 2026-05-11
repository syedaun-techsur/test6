/**
 * Render tasks into #task-list. Toggle #empty-state visibility.
 * @param {Array<{id: string, title: string, completed: boolean}>} tasks
 */
export function renderTasks(tasks) {
  const list = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');

  // Clear existing items before re-render
  list.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark "${task.title}" complete`);
    // NOTE: onclick handler wired in Phase 2

    // Title
    const title = document.createElement('span');
    title.className = task.completed ? 'task-title completed' : 'task-title';
    title.textContent = task.title;

    // Delete button (styled but not functional until Phase 2)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.setAttribute('aria-label', `Delete "${task.title}"`);
    // NOTE: onclick handler wired in Phase 2

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}
