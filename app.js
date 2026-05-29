import { loadTasks, saveTasks } from './storage.js';
import { renderTasks } from './renderer.js';

// In-memory task list (single source of truth for the session)
let tasks = [];

/**
 * Generate a simple unique ID for a new task.
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * Add a new task with the given title.
 * Validates that title is non-empty. Shows validation message if invalid.
 * @param {string} rawTitle
 */
function addTask(rawTitle) {
  const validationMsg = document.getElementById('validation-msg');
  const title = rawTitle.trim();

  if (!title) {
    validationMsg.hidden = false;
    setTimeout(() => { validationMsg.hidden = true; }, 2000);
    return;
  }

  validationMsg.hidden = true;

  const newTask = { id: generateId(), title, completed: false };
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks(tasks);
  document.getElementById('new-task-input').value = '';
}

/**
 * Toggle a task's completed state by id.
 * @param {string} id
 */
function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks(tasks);
  renderTasks(tasks);
}

/**
 * Delete a task permanently by id.
 * @param {string} id
 */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
  renderTasks(tasks);
}

// Load and render tasks when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  tasks = loadTasks();
  renderTasks(tasks);

  // Wire add button
  document.getElementById('add-task-btn').addEventListener('click', () => {
    addTask(document.getElementById('new-task-input').value);
  });

  // Wire Enter key on input
  document.getElementById('new-task-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTask(document.getElementById('new-task-input').value);
    }
  });

  // Event delegation for task interactions (toggle + delete)
  // Single listener on #task-list handles all current and future task items
  document.getElementById('task-list').addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const li = e.target.closest('li[data-id]');
      if (li) toggleTask(li.dataset.id);
    }
  });

  document.getElementById('task-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const li = e.target.closest('li[data-id]');
      if (li) deleteTask(li.dataset.id);
    }
  });
});
