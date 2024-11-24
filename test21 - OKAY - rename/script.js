// https://www.youtube.com/watch?v=jfYWwQrtzzY

// TO DO:
// make the calendar part follow the rest of the sidebar
// then create a function to sort task-list items 


const calendar_containers = document.querySelectorAll('.calendar-slots-container')
const tasklist_container = document.querySelectorAll('.task-list')

console.log("Hello")

function initialize_task_drag_behavior() {
    /*=======================================================================
    Function to initialize or reinitialize task movement, and task shadow.
    About task drag and drop.
    =======================================================================*/
    
    // Get all tasks
    const draggable_tasks = document.querySelectorAll('.draggable-task')

    // Give the tasks an event listener
    draggable_tasks.forEach(a_task => {
        // When drag start, opacity 50% (in class dragging)
        a_task.addEventListener('dragstart', () => {
            a_task.classList.add('task-dragging')
        })

        // When drag ends, return to original opacity
        a_task.addEventListener('dragend', () => {
            a_task.classList.remove('task-dragging')
        })
    })
}

function initialize_calendar_slots() {
    /*=======================================================================
    Function to initialize or reinitialize calendar slots for dropping task
    items on it. A calendar slot can only accepts one task.
    =======================================================================*/

    calendar_containers.forEach(a_container => {
        a_container.addEventListener('dragover', (the_cursor) => {
            the_cursor.preventDefault()
            console.log("Draggable object dragged over container") // for testing
    
            // You can place an task only if there's no task in the slot.
            if (a_container.childElementCount === 0) {
                const being_dragged = document.querySelector('.task-dragging')
                task_on_calendar(being_dragged)
                a_container.appendChild(being_dragged)
            }
        })
    })
}

function initialize_tasklist_slots() {
    /*=======================================================================
    Function to initialize or reinitialize the tasklist for dropping task
    items on it. The tasklist can accept any number of tasks.
    =======================================================================*/
    tasklist_container.forEach(a_container => {
        a_container.addEventListener('dragover', (the_cursor) => {
            the_cursor.preventDefault()
            console.log("Draggable object dragged over tasklist") // for testing
            const being_dragged = document.querySelector('.task-dragging')
            task_on_tasklist(being_dragged)
            a_container.appendChild(being_dragged)
        })
    })
}

initialize_task_drag_behavior() // do at least once
initialize_calendar_slots() // do at least once
initialize_tasklist_slots() // do at least once


function task_on_calendar(draggable_task) {
    /*=======================================================================
    Function to change the formatting of a task object when hovered over any
    calendar slot. Only visually important features remain.
    =======================================================================*/
    draggable_task.classList.remove('task-list-format')
    draggable_task.classList.add('calendar-format')

    // disable some features
    const description_text = draggable_task.children[1]
    description_text.classList.add('hidden')
}

function task_on_tasklist(draggable_task) {
    /*=======================================================================
    Function to change the formatting of a task object when hovered over the
    task-list.
    =======================================================================*/
    draggable_task.classList.remove('calendar-format')
    draggable_task.classList.add('task-list-format')

    // enable some features
    const description_text = draggable_task.children[1]
    description_text.classList.remove('hidden')
}