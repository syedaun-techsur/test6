const STORAGE_KEY = 'todo-tasks';

/**
 * Load tasks from localStorage.
 * @returns {Array<{id: string, title: string, completed: boolean}>}
 */
export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Guard: ensure it's an array; ignore corrupted data
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist tasks to localStorage.
 * @param {Array<{id: string, title: string, completed: boolean}>} tasks
 */
export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
