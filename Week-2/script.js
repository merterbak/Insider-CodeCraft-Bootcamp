let tasks = [];
let showOnlyCompleted = false;
let isSortedByPriority = false;
const priorityOrder = { low: 1, medium: 2, high: 3 };



function createTask(title, description, priority) {
    const newTask = {
        id: Date.now(), 
        title: title,
        description: description || "No description",
        priority: priority,
        completed: false,
        order: tasks.length
    };
    return newTask;
}

function addTask(event) {
    event.preventDefault(); 
    event.stopPropagation(); 
    const form = event.target;
    const errorMessage = form.querySelector(".error-message");
    errorMessage.textContent = ""; 
    const title = form.querySelector(".title-input").value.trim();
    const description = form.querySelector(".description-input").value.trim();
    const priority = form.querySelector('input[name="priority"]:checked');
    
    try {
        if (!title) {
            throw new Error("Please enter a title!");
        }
        if (!priority) {
            throw new Error("Please select a priority!");
        }
        const newTask = createTask(title, description, priority.value);
        tasks.push(newTask);
        showTasks();
        form.reset(); 
    } catch (error) {
        errorMessage.textContent = error.message; 
    }
}

function showTasks() {
    const taskList = document.querySelector(".task-list");
    let tasksToShow = tasks;

    if (showOnlyCompleted) {
        tasksToShow = tasks.filter(task => task.completed);
    }
    
    if (tasksToShow.length === 0 && showOnlyCompleted) {
        taskList.innerHTML = '<li style="text-align: center;">No completed tasks yet!</li>';
    } else {
        taskList.innerHTML = tasksToShow.map(task => `
            <li data-id="${task.id}" class="${task.completed ? 'completed' : ''}">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Priority: ${task.priority}</p>
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </li>
        `).join('');
    }
}

function handleClicks(event) {
    const clickedElement = event.target;
    const listItem = clickedElement.closest("li");

    if (listItem) {
        const taskId = Number(listItem.dataset.id);
        const task = tasks.find(t => t.id === taskId);

        if (clickedElement.classList.contains("complete-btn")) {
            event.stopPropagation(); 
            task.completed = !task.completed; 
            showTasks();
        } else if (clickedElement.classList.contains("delete-btn")) {
            event.stopPropagation(); 
            tasks = tasks.filter(t => t.id !== taskId); 
            showTasks();
        }
    }
    else if (clickedElement.classList.contains("toggle-completed")) {
        event.stopPropagation(); 
        showOnlyCompleted = !showOnlyCompleted;
        clickedElement.textContent = showOnlyCompleted ? "Show All Tasks" : "Show Only Completed";
        showTasks();
    }
    else if (clickedElement.classList.contains("sort-priority")) {
        event.stopPropagation(); 
        isSortedByPriority = !isSortedByPriority;
        clickedElement.textContent = isSortedByPriority ? "Back to Original Order" : "Sort by Priority";

        if (isSortedByPriority) {
            tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else {
            tasks.sort((a, b) => a.order - b.order);
        }
        showTasks();
    }
}

function init() {
    const container = document.querySelector(".container");
    container.addEventListener("submit", addTask);
    container.addEventListener("click", handleClicks);
    showTasks();
}

init();