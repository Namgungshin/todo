const STORAGE_KEY = "todos";

const addForm = document.getElementById("add-form");
const newTodoInput = document.getElementById("new-todo-input");
const todoList = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const todoFooter = document.getElementById("todo-footer");
const itemsLeft = document.getElementById("items-left");
const filterButtons = document.querySelectorAll(".filters__button");
const clearCompletedButton = document.getElementById("clear-completed");

let todos = loadTodos();
let currentFilter = "all";

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  todos.push({ id: createId(), text: trimmed, completed: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function editTodo(id, text) {
  const trimmed = text.trim();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  if (!trimmed) {
    deleteTodo(id);
    return;
  }
  todo.text = trimmed;
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  render();
}

function getFilteredTodos() {
  if (currentFilter === "active") return todos.filter((t) => !t.completed);
  if (currentFilter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

function startEditing(li, todo) {
  const textEl = li.querySelector(".todo-item__text");
  const input = document.createElement("input");
  input.type = "text";
  input.className = "todo-item__edit-input";
  input.value = todo.text;
  textEl.replaceWith(input);
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);

  let finished = false;
  const finish = (commit) => {
    if (finished) return;
    finished = true;
    if (commit) editTodo(todo.id, input.value);
    else render();
  };

  input.addEventListener("blur", () => finish(true));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finish(true);
    } else if (e.key === "Escape") {
      e.preventDefault();
      finish(false);
    }
  });
}

function render() {
  const filtered = getFilteredTodos();

  todoList.innerHTML = "";
  filtered.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " is-completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-item__checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-item__text";
    text.textContent = todo.text;
    text.addEventListener("dblclick", () => startEditing(li, todo));

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "todo-item__delete";
    deleteBtn.setAttribute("aria-label", "삭제");
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, text, deleteBtn);
    todoList.appendChild(li);
  });

  emptyState.hidden = filtered.length > 0;
  todoFooter.hidden = todos.length === 0;

  const activeCount = todos.filter((t) => !t.completed).length;
  itemsLeft.textContent = `${activeCount}개 남음`;

  filterButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.filter === currentFilter);
  });
}

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(newTodoInput.value);
  newTodoInput.value = "";
  newTodoInput.focus();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    render();
  });
});

clearCompletedButton.addEventListener("click", clearCompleted);

render();
