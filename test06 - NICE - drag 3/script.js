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

// enough for movement
containers.forEach(a_container => {
    a_container.addEventListener('dragover', (the_cursor) => {
        the_cursor.preventDefault()
        console.log("Draggable object dragged over container") // for testing

        if (a_container.childElementCount === 0) {
            const a_draggable_shadow = document.querySelector('.dragging')
            a_container.appendChild(a_draggable_shadow)
        }
    })
})
sidebar_container.forEach(a_container => {
    a_container.addEventListener('dragover', (the_cursor) => {
        the_cursor.preventDefault()
        console.log("Draggable object dragged over sidebar") // for testing
        const a_draggable_shadow = document.querySelector('.dragging')
        a_container.appendChild(a_draggable_shadow)
    })
})
