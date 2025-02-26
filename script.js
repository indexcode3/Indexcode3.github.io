document.addEventListener("DOMContentLoaded", () => {
    const columns = document.querySelectorAll(".column");
    let draggedTask = null;

    function loadTasks() {
        columns.forEach(column => {
            const columnName = column.getAttribute("data-column");
            const savedTasks = JSON.parse(localStorage.getItem(columnName)) || [];
            const taskList = column.querySelector(".task-list");

            taskList.innerHTML = "";
            savedTasks.forEach(taskText => {
                const task = createTask(taskText);
                taskList.appendChild(task);
            });
        });
    }

    function createTask(text = "เขียน") {
        const task = document.createElement("div");
        task.classList.add("task");
        task.setAttribute("contenteditable", "true");
        task.textContent = text;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-task");
        deleteButton.textContent = "×";
        deleteButton.addEventListener("click", () => {
            task.remove();
            saveTasks();
        });

        task.appendChild(deleteButton);

        task.draggable = true;
        task.addEventListener("dragstart", () => {
            draggedTask = task;
            setTimeout(() => task.style.display = "none", 0);
        });

        task.addEventListener("dragend", () => {
            setTimeout(() => {
                draggedTask.style.display = "block";
                draggedTask = null;
                saveTasks();
            }, 0);
        });

        task.addEventListener("input", saveTasks);

        return task;
    }

    function saveTasks() {
        columns.forEach(column => {
            const columnName = column.getAttribute("data-column");
            const tasks = Array.from(column.querySelectorAll(".task")).map(task => task.innerText);
            localStorage.setItem(columnName, JSON.stringify(tasks));
        });
    }

    columns.forEach(column => {
        const taskList = column.querySelector(".task-list");
        const addButton = column.querySelector(".add-task");

        addButton.addEventListener("click", () => {
            const newTask = createTask();
            taskList.appendChild(newTask);
            saveTasks();
        });

        column.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        column.addEventListener("drop", () => {
            if (draggedTask) {
                taskList.appendChild(draggedTask);
                saveTasks();
            }
        });
    });

    loadTasks();
});
