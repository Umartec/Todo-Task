document.addEventListener("DOMContentLoaded", () => {
    // Preloader
    setTimeout(() => {
        document.querySelector(".loader").classList.add("hidden");
        document.querySelector(".container").classList.remove("hidden");
        document.body.style.visibility = "visible";
    }, 1500);

    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    // Load tasks from localStorage
    loadTasks();

    function loadTasks() {
        // Retrieve tasks from localStorage (if any)
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

        savedTasks.forEach((task) => {
            const li = createTaskElement(task.text, task.completed);
            taskList.appendChild(li);
        });
    }

    function createTaskElement(taskText, completed = false) {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="check-uncheck ${completed ? 'checked' : ''}"><i class="fas fa-circle"></i></span>
            <span class="task-text ${completed ? 'completed' : ''}">${taskText}</span>
            <div class="task-actions">
                <button class="edit-task"><i class="fas fa-edit"></i></button>
                <button class="delete-task"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

        li.querySelector(".edit-task").addEventListener("click", () => editTask(li));
        li.querySelector(".delete-task").addEventListener("click", () => deleteTask(li));
        li.querySelector(".check-uncheck").addEventListener("click", () => toggleComplete(li, taskText));

        return li;
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const li = createTaskElement(taskText);

        // Add the new task to the task list
        taskList.appendChild(li);

        // Save the tasks in localStorage
        saveTasks();

        // Clear input field
        taskInput.value = "";
    }

    function editTask(taskItem) {
        const taskText = taskItem.querySelector(".task-text");
        const newText = prompt("Edit your task:", taskText.textContent);
        if (newText !== null && newText.trim() !== "") {
            taskText.textContent = newText;

            // Update the tasks in localStorage
            saveTasks();
        }
    }

    function deleteTask(taskItem) {
        taskItem.classList.add("fade-out");
        setTimeout(() => {
            taskItem.remove();
            saveTasks(); // Update localStorage after deleting the task
        }, 300);
    }

    function toggleComplete(taskItem, taskText) {
        const checkIcon = taskItem.querySelector(".check-uncheck");
        checkIcon.classList.toggle("checked");
        const taskTextElement = taskItem.querySelector(".task-text");
        taskItem.classList.toggle("completed");

        // Update the task status in localStorage
        saveTasks();
    }

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        const taskItems = taskList.querySelectorAll("li");

        taskItems.forEach((taskItem) => {
            const taskText = taskItem.querySelector(".task-text").textContent;
            const completed = taskItem.classList.contains("completed");

            tasks.push({ text: taskText, completed });
        });

        // Store the tasks in localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    addTaskBtn.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    });
});
