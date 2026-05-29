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
    // Auto-hide the message after 2 seconds
    setTimeout(() => { validationMsg.hidden = true; }, 2000);
    return;
  }

  validationMsg.hidden = true;

  const newTask = { id: generateId(), title, completed: false };
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks(tasks);

  // Clear the input
  document.getElementById('new-task-input').value = '';
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
});
