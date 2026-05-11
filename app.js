import { loadTasks } from './storage.js';
import { renderTasks } from './renderer.js';

// Load and render tasks when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const tasks = loadTasks();
  renderTasks(tasks);
});
