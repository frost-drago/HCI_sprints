// Initialize the current date and week
let currentDate = new Date(); // Get the current date
let currentWeek = getWeekRange(currentDate); // Get the start and end dates of the current week

// Function to get the start and end dates for the week
function getWeekRange(date) {
    const startDate = new Date(date);
    const endDate = new Date(date);

    // Calculate the start of the week (Sunday)
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    startDate.setDate(diff);

    // Calculate the end of the week (Saturday)
    endDate.setDate(startDate.getDate() + 6);

    return { start: startDate, end: endDate };
}

// Update the displayed week and month
function updateWeekDisplay() {
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[currentDate.getMonth()];
    const weekOfDate = `${currentWeek.start.getDate()}${getDateSuffix(currentWeek.start.getDate())} - ${currentWeek.end.getDate()}${getDateSuffix(currentWeek.end.getDate())}`;
    
    document.getElementById("month-name").textContent = monthName;
    document.getElementById("week-of-date").textContent = `Week of: ${weekOfDate}`;
}

// Helper function to add suffixes to the day of the month (e.g., 1st, 2nd, 3rd)
function getDateSuffix(date) {
    if (date > 3 && date < 21) return "th";
    switch (date % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

// Function to change the week (Prev or Next)
function changeWeek(direction) {
    currentDate.setDate(currentDate.getDate() + direction * 7);
    currentWeek = getWeekRange(currentDate);
    updateWeekDisplay();
}

// Toggle mini calendar visibility
function toggleMiniCalendar() {
    const miniCalendar = document.getElementById("mini-calendar");
    if (miniCalendar.style.display === "none" || miniCalendar.style.display === "") {
        miniCalendar.style.display = "block";
        generateMiniCalendar();
    } else {
        miniCalendar.style.display = "none";
    }
}

// Function to generate the mini calendar for the current month
function generateMiniCalendar() {
    const calendarContent = document.getElementById("calendar-content");
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const daysArray = [];
    for (let i = 0; i < firstDayOfWeek; i++) daysArray.push("");
    for (let day = 1; day <= daysInMonth; day++) daysArray.push(day);

    let calendarHTML = '<div class="calendar-days">';
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayLabels.forEach(day => {
        calendarHTML += `<div class="calendar-day">${day}</div>`;
    });

    daysArray.forEach((day, index) => {
        if (day === "") {
            calendarHTML += `<div class="calendar-day"></div>`;
        } else {
            const isToday = day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();
            calendarHTML += `<div class="calendar-day${isToday ? " current-day" : ""}">${day}</div>`;
        }
        if ((index + 1) % 7 === 0) {
            calendarHTML += '</div><div class="calendar-days">';
        }
    });

    calendarHTML += '</div>';
    calendarContent.innerHTML = calendarHTML;
}

// Initialize drag-and-drop behavior for tasks
function initializeTaskDragBehavior() {
    document.addEventListener("dragstart", e => {
        if (e.target.classList.contains("draggable-task")) {
            e.target.style.opacity = "0.5";
            e.target.classList.add("dragging");
        }
    });

    document.addEventListener("dragend", e => {
        if (e.target.classList.contains("draggable-task")) {
            e.target.style.opacity = "1";
            e.target.classList.remove("dragging");
            displayFeedback("Task moved successfully.");
        }
    });
}

// Initialize calendar slots for task drop behavior
function initializeCalendarSlots() {
    document.querySelectorAll(".calendar-slot").forEach(slot => {
        slot.addEventListener("dragover", e => e.preventDefault());
        slot.addEventListener("drop", e => {
            const task = document.querySelector(".dragging");
            if (task && !slot.querySelector(".draggable-task")) {
                slot.appendChild(task);
                modifyTaskAppearanceForCalendar(task);
            } else if (task) {
                displayFeedback("Only one task can be placed in each slot.");
            }
        });
    });
}

// Modify task appearance for the calendar
function modifyTaskAppearanceForCalendar(task) {
    task.querySelector(".task-description").style.display = "none";
}

// Add a new task
function addTask(event) {
    event.preventDefault();
    const taskName = document.getElementById("taskTitle").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskDifficulty = document.getElementById("Difficulty").value;
    const taskImpact = document.getElementById("Impact").value;

    const task = createTask(taskName, taskDescription, taskDifficulty, taskImpact);
    document.querySelector(".task-list").appendChild(task);
    displayFeedback("Task added successfully.");
}

// Create a new task
function createTask(name, description, difficulty, impact) {
    const task = document.createElement("div");
    task.className = "draggable-task";
    task.setAttribute("draggable", "true");
    task.innerHTML = `
        <span class="task-name">${name}</span>
        <span class="task-difficulty">${difficulty}</span>
        <span class="task-impact">${impact}</span>
        <span class="task-description">${description}</span>
        <button class="close-button">X</button>
    `;
    return task;
}

// Display feedback to the user
function displayFeedback(message) {
    const feedback = document.getElementById("feedback");
    feedback.textContent = message;
    setTimeout(() => feedback.textContent = "", 2000);
}

// Attach event listener to the task form
document.getElementById("taskForm").addEventListener("submit", addTask);

// Initialize functions
updateWeekDisplay();
initializeTaskDragBehavior();
initializeCalendarSlots();
