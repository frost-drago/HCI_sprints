// https://www.youtube.com/watch?v=jfYWwQrtzzY

const draggable_items = document.querySelectorAll('.draggable-item')
const containers = document.querySelectorAll('.container')
const sidebar_container = document.querySelectorAll('.sidebar')

console.log("Hello")

// Dragging behavior, like... drag shadow
draggable_items.forEach(a_draggable => {
    a_draggable.addEventListener('dragstart', () => {
        a_draggable.classList.add('dragging')
        console.log("Draggable item: Start dragging") // for testing
    })

    a_draggable.addEventListener('dragend', () => {
        a_draggable.classList.remove('dragging')
        console.log("Draggable item: Stop dragging") // for testing
    })
})

// calendar
// enough for movement
containers.forEach(a_container => {
    a_container.addEventListener('dragover', (the_cursor) => {
        the_cursor.preventDefault()
        console.log("Draggable object dragged over container") // for testing

        if (a_container.childElementCount === 0) {
            const being_dragged = document.querySelector('.dragging')
            task_on_calendar(being_dragged)
            a_container.appendChild(being_dragged)
        }
    })
})

// for sidebar
console.log(sidebar_container)
sidebar_container.forEach(a_container => {
    a_container.addEventListener('dragover', (the_cursor) => {
        the_cursor.preventDefault()
        console.log("Draggable object dragged over sidebar") // for testing
        const being_dragged = document.querySelector('.dragging')
        task_on_sidebar(being_dragged)
        a_container.appendChild(being_dragged)
    })
})

function task_on_calendar(an_object) {
    an_object.classList.remove('task-list-format')
    an_object.classList.add('calendar-format')

    // disable some features
    const description_text = an_object.children[1]
    description_text.classList.add('hidden')
}

function task_on_sidebar(an_object) {
    an_object.classList.remove('calendar-format')
    an_object.classList.add('task-list-format')

    // disable some features
    const description_text = an_object.children[1]
    description_text.classList.remove('hidden')
}