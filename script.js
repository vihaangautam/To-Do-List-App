document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const inputBox = document.getElementById("input-box");
  const listContainer = document.getElementById("list-container");
  const completedCounter = document.getElementById("completed-counter");
  const uncompletedCounter = document.getElementById("uncompleted-counter");
  const inputButton = document.getElementById("input-button");
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  // Load tasks and dark mode preference from local storage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  // Apply dark mode if previously enabled
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }

  // Dark mode toggle
  darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkModeToggle.checked);
  });

  // Render tasks from local storage
  function renderTasks() {
    listContainer.innerHTML = '';
    tasks.forEach((task, index) => createTaskElement(task, index));
    updateCounters();
  }

  // Create task element
  function createTaskElement(task, index) {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span>${task.text}</span>
      </label>
      <span class="edit-btn">Edit</span>
      <span class="delete-btn">Delete</span>
    `;

    if (task.completed) li.classList.add('completed');

    const checkbox = li.querySelector("input");
    const editBtn = li.querySelector(".edit-btn");
    const taskSpan = li.querySelector("span:nth-child(2)");
    const deleteBtn = li.querySelector(".delete-btn");

    // Checkbox event listener
    checkbox.addEventListener("click", () => {
      tasks[index].completed = checkbox.checked;
      li.classList.toggle("completed", checkbox.checked);
      saveTasks();
      updateCounters();
    });

    // Edit button event listener
    editBtn.addEventListener("click", () => {
      const update = prompt("Edit task:", taskSpan.textContent);
      if (update !== null) {
        tasks[index].text = update.trim();
        taskSpan.textContent = update.trim();
        li.classList.remove("completed");
        checkbox.checked = false;
        saveTasks();
        updateCounters();
      }
    });

    // Delete button event listener
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      }
    });

    listContainer.appendChild(li);
  }

  // Add new task
  function addTask() {
    const task = inputBox.value.trim();
    if (!task) {
      alert("Please write down a task");
      return;
    }

    tasks.push({ text: task, completed: false });
    inputBox.value = "";
    saveTasks();
    renderTasks();
  }

  // Save tasks to local storage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Update task counters
  function updateCounters() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const uncompletedTasks = tasks.length - completedTasks;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
  }

  // Event listeners
  inputButton.addEventListener('click', addTask);
  inputBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Initial render
  renderTasks();
});
