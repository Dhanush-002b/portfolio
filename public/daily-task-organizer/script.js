"use strict";

const STORAGE_KEY = "daymark.tasks.v1";
const THEME_KEY = "daymark.theme";
const categories = ["Work", "Personal", "Study", "Other"];
const state = { tasks: loadTasks(), view: "all", filter: "all", category: null, search: "", sort: "date" };

const elements = {
  taskList: document.querySelector("#taskList"),
  taskModal: document.querySelector("#taskModal"),
  taskForm: document.querySelector("#taskForm"),
  taskTitle: document.querySelector("#taskTitle"),
  taskDescription: document.querySelector("#taskDescription"),
  taskDue: document.querySelector("#taskDue"),
  taskPriority: document.querySelector("#taskPriority"),
  taskCategory: document.querySelector("#taskCategory"),
  taskId: document.querySelector("#taskId"),
  modalTitle: document.querySelector("#modalTitle"),
  saveTaskButton: document.querySelector("#saveTaskButton"),
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  toast: document.querySelector("#toast")
};

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((task) => task && typeof task.id === "string" && typeof task.title === "string")
      .map((task) => ({
        id: task.id,
        title: task.title,
        description: typeof task.description === "string" ? task.description : "",
        dueDate: typeof task.dueDate === "string" ? task.dueDate : "",
        priority: ["low", "medium", "high"].includes(task.priority) ? task.priority : "medium",
        category: categories.includes(task.category) ? task.category : "Other",
        completed: task.completed === true,
        createdAt: Number.isFinite(task.createdAt) ? task.createdAt : Date.now()
      }));
  } catch (error) {
    console.error("Could not load saved tasks.", error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  } catch (error) {
    console.error("Could not save tasks to browser storage.", error);
    showToast("Your changes could not be saved. Check browser storage settings.");
  }
}

function dateOnly(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  if (dateString === dateOnly()) return "Today";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateString === dateOnly(tomorrow)) return "Tomorrow";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function setDateAndGreeting() {
  const now = new Date();
  document.querySelector("#topDate").textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(now);
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  document.querySelector("#pageTitle").innerHTML = `${greeting}<span class="title-period">.</span>`;
  document.querySelector("#greetingEyebrow").textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(now).toUpperCase();
}

function byDueDate(a, b) {
  if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt;
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return a.dueDate.localeCompare(b.dueDate) || b.createdAt - a.createdAt;
}

function getVisibleTasks() {
  let tasks = [...state.tasks];
  if (state.view === "today") tasks = tasks.filter((task) => task.dueDate === dateOnly() && !task.completed);
  if (state.view === "upcoming") tasks = tasks.filter((task) => task.dueDate > dateOnly() && !task.completed);
  if (state.view === "completed") tasks = tasks.filter((task) => task.completed);
  if (state.category) tasks = tasks.filter((task) => task.category === state.category);
  if (state.filter === "active") tasks = tasks.filter((task) => !task.completed);
  if (state.filter === "completed") tasks = tasks.filter((task) => task.completed);
  if (state.search) {
    const query = state.search.toLocaleLowerCase();
    tasks = tasks.filter((task) => `${task.title} ${task.description} ${task.category}`.toLocaleLowerCase().includes(query));
  }
  if (state.sort === "priority") {
    const order = { high: 0, medium: 1, low: 2 };
    tasks.sort((a, b) => order[a.priority] - order[b.priority] || byDueDate(a, b));
  } else if (state.sort === "created") tasks.sort((a, b) => b.createdAt - a.createdAt);
  else tasks.sort(byDueDate);
  return tasks;
}

function createTaskRow(task) {
  const row = document.createElement("article");
  row.className = `task-row${task.completed ? " is-complete" : ""}`;
  const checkbox = document.createElement("input");
  checkbox.className = "task-check";
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `${task.completed ? "Mark incomplete" : "Mark complete"}: ${task.title}`);
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const main = document.createElement("div");
  main.className = "task-main";
  const title = document.createElement("p");
  title.className = "task-title";
  title.textContent = task.title;
  const description = document.createElement("p");
  description.className = "task-description";
  description.textContent = task.description;
  if (!task.description) description.hidden = true;
  main.append(title, description);

  const meta = document.createElement("div");
  meta.className = "task-meta";
  const category = document.createElement("span");
  category.className = "task-category";
  category.dataset.category = task.category;
  category.textContent = task.category;
  meta.append(category);

  if (task.dueDate) {
    const due = document.createElement("span");
    due.className = "task-due";
    due.textContent = formatDate(task.dueDate);
    if (!task.completed && task.dueDate < dateOnly()) due.classList.add("overdue");
    if (!task.completed && task.dueDate === dateOnly()) due.classList.add("due-today");
    meta.append(due);
  }
  const priority = document.createElement("span");
  priority.className = `priority-badge priority-${task.priority}`;
  priority.textContent = task.priority[0].toUpperCase() + task.priority.slice(1);
  meta.append(priority);

  const actions = document.createElement("div");
  actions.className = "task-actions";
  const edit = document.createElement("button");
  edit.className = "task-action";
  edit.type = "button";
  edit.textContent = "✎";
  edit.setAttribute("aria-label", `Edit ${task.title}`);
  edit.title = "Edit task";
  edit.addEventListener("click", () => openModal(task));
  const remove = document.createElement("button");
  remove.className = "task-action delete";
  remove.type = "button";
  remove.textContent = "×";
  remove.setAttribute("aria-label", `Delete ${task.title}`);
  remove.title = "Delete task";
  remove.addEventListener("click", () => deleteTask(task.id));
  actions.append(edit, remove);
  meta.append(actions);
  row.append(checkbox, main, meta);
  return row;
}

function renderEmptyState() {
  const empty = document.createElement("div");
  empty.className = "empty-state";
  const icon = document.createElement("span");
  icon.className = "empty-illustration";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = state.search ? "⌕" : "✦";
  const heading = document.createElement("strong");
  const message = document.createElement("p");
  const action = document.createElement("button");
  if (state.search) {
    heading.textContent = "No tasks found";
    message.textContent = "Try another search or clear your search.";
    action.textContent = "Clear search";
    action.addEventListener("click", () => { state.search = ""; elements.searchInput.value = ""; render(); });
  } else if (state.view === "completed" || state.filter === "completed") {
    heading.textContent = "Nothing completed just yet";
    message.textContent = "Finished tasks will find their way here.";
    action.textContent = "See all tasks";
    action.addEventListener("click", () => setView("all"));
  } else {
    heading.textContent = state.category ? `No ${state.category.toLowerCase()} tasks yet` : "Your list is looking clear";
    message.textContent = "A little space for something new.";
    action.textContent = "Add your first task";
    action.addEventListener("click", () => openModal());
  }
  empty.append(icon, heading, message, action);
  return empty;
}

function updateHeadings() {
  const titles = { all: "All tasks", today: "Today", upcoming: "Upcoming", completed: "Completed" };
  const title = state.category || titles[state.view] || "All tasks";
  document.querySelector("#breadcrumbView").textContent = title;
  document.querySelector("#listHeading").textContent = state.search ? "Search results" : state.category ? `${state.category} tasks` : state.view === "all" ? "Your tasks" : title;
  const captions = { all: "Everything you want to get done.", today: "The things you plan to tackle today.", upcoming: "A look at what's coming up next.", completed: "Take a moment to appreciate how far you've come." };
  document.querySelector("#listCaption").textContent = state.category ? `A little progress in ${state.category.toLowerCase()}.` : state.search ? `Matching “${state.search}”.` : captions[state.view];
}

function render() {
  const visible = getVisibleTasks();
  elements.taskList.replaceChildren(...(visible.length ? visible.map(createTaskRow) : [renderEmptyState()]));
  const active = state.tasks.filter((task) => !task.completed).length;
  const completed = state.tasks.length - active;
  document.querySelector("#allCount").textContent = state.tasks.length;
  document.querySelector("#todayCount").textContent = state.tasks.filter((task) => task.dueDate === dateOnly() && !task.completed).length;
  document.querySelector("#completedCount").textContent = completed;
  document.querySelector("#statTotal").textContent = state.tasks.length;
  document.querySelector("#statPending").textContent = active;
  document.querySelector("#statCompleted").textContent = completed;
  const percent = state.tasks.length ? Math.round(completed / state.tasks.length * 100) : 0;
  document.querySelector("#focusPercent").textContent = percent;
  document.querySelector("#totalProgress").style.width = `${percent}%`;
  document.querySelector("#completionNote").textContent = completed ? `${percent}% of your list` : "Keep it up!";
  document.querySelector("#focusBars").replaceChildren(...Array.from({ length: 10 }, (_, index) => {
    const bar = document.createElement("span");
    if (index < Math.round(percent / 10)) bar.className = "filled";
    return bar;
  }));
  document.querySelector("#filterAllCount").textContent = state.tasks.length;
  document.querySelector("#filterActiveCount").textContent = active;
  document.querySelector("#filterCompletedCount").textContent = completed;
  document.querySelector("#listFooterText").textContent = `${visible.length} ${visible.length === 1 ? "task" : "tasks"}`;
  updateHeadings();
}

function setView(view) {
  state.view = view;
  state.category = null;
  document.querySelectorAll(".nav-item[data-view]").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  document.querySelectorAll(".category-item").forEach((item) => item.classList.remove("active"));
  render();
}

function openModal(task = null) {
  elements.taskForm.reset();
  elements.taskId.value = task ? task.id : "";
  elements.taskTitle.value = task ? task.title : "";
  elements.taskDescription.value = task ? task.description : "";
  elements.taskDue.value = task ? task.dueDate : "";
  elements.taskPriority.value = task ? task.priority : "medium";
  elements.taskCategory.value = task ? task.category : "Work";
  elements.modalTitle.textContent = task ? "Edit task" : "Add a task";
  elements.saveTaskButton.innerHTML = task ? 'Save changes <span aria-hidden="true">→</span>' : 'Add task <span aria-hidden="true">→</span>';
  elements.taskModal.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => elements.taskTitle.focus());
}

function closeModal() {
  elements.taskModal.hidden = true;
  document.body.style.overflow = "";
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 2400);
}

function toggleTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  render();
  showToast(task.completed ? "Nicely done — task completed!" : "Task moved back to your list.");
}

function deleteTask(id) {
  if (!state.tasks.some((task) => task.id === id)) return;
  state.tasks = state.tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
  showToast("Task deleted.");
}

elements.taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = elements.taskTitle.value.trim();
  if (!title) { elements.taskTitle.focus(); return; }
  const data = {
    title,
    description: elements.taskDescription.value.trim(),
    dueDate: elements.taskDue.value,
    priority: elements.taskPriority.value,
    category: elements.taskCategory.value
  };
  const existing = state.tasks.find((task) => task.id === elements.taskId.value);
  if (existing) {
    Object.assign(existing, data);
    showToast("Your task has been updated.");
  } else {
    state.tasks.unshift({ ...data, id: crypto.randomUUID(), completed: false, createdAt: Date.now() });
    showToast("Task added. You've got this!");
  }
  saveTasks();
  closeModal();
  render();
});

document.querySelector("#addTaskButton").addEventListener("click", () => openModal());
document.querySelector("#sidebarAddTask").addEventListener("click", () => openModal());
document.querySelector("#closeModal").addEventListener("click", closeModal);
document.querySelector("#cancelModal").addEventListener("click", closeModal);
elements.taskModal.addEventListener("click", (event) => { if (event.target === elements.taskModal) closeModal(); });
document.querySelectorAll(".nav-item[data-view]").forEach((item) => item.addEventListener("click", () => {
  setView(item.dataset.view);
  document.querySelector("#sidebar").classList.remove("open");
}));
document.querySelectorAll(".category-item").forEach((item) => item.addEventListener("click", () => {
  state.category = item.dataset.category;
  state.view = "all";
  document.querySelectorAll(".nav-item").forEach((navItem) => navItem.classList.remove("active"));
  item.classList.add("active");
  render();
  document.querySelector("#sidebar").classList.remove("open");
}));
document.querySelectorAll(".filter-chip").forEach((item) => item.addEventListener("click", () => {
  state.filter = item.dataset.filter;
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip === item));
  render();
}));
elements.searchInput.addEventListener("input", () => { state.search = elements.searchInput.value.trim(); render(); });
elements.sortSelect.addEventListener("change", () => { state.sort = elements.sortSelect.value; render(); });
document.querySelector("#mobileMenu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  try { localStorage.setItem(THEME_KEY, document.body.classList.contains("dark-theme") ? "dark" : "light"); }
  catch (error) { console.error("Could not save theme preference.", error); }
});
try { if (localStorage.getItem(THEME_KEY) === "dark") document.body.classList.add("dark-theme"); }
catch (error) { console.error("Could not load theme preference.", error); }

document.addEventListener("keydown", (event) => {
  const modalOpen = !elements.taskModal.hidden;
  const tag = document.activeElement.tagName;
  if (event.key === "Escape" && modalOpen) closeModal();
  if (event.key.toLowerCase() === "n" && !modalOpen && !event.ctrlKey && !event.metaKey && !event.altKey && !["INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
    event.preventDefault();
    openModal();
  }
  if (event.key === "/" && !modalOpen && !["INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
    event.preventDefault();
    elements.searchInput.focus();
  }
});

document.querySelector("#sortSelect").value = state.sort;
setDateAndGreeting();
render();
