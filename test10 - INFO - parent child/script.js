// https://www.youtube.com/watch?v=jfYWwQrtzzY

const draggable_items = document.querySelectorAll('.draggable-item')
const containers = document.querySelectorAll('.container')

console.log("Hello")

// Dragging behavior, like... drag shadow
draggable_items.forEach(a_draggable => {
    a_draggable.addEventListener('dragstart', () => {
        a_draggable.classList.add('dragging')
        console.log("Draggable item: Start dragging")

        /* Testing about parent and children */
        const parent_container = a_draggable.parentElement
        if (a_draggable === parent_container.children[0]) {
            console.log("I'm first")
        } else {
            console.log("Not the first")
        }

    })

    a_draggable.addEventListener('dragend', () => {
        a_draggable.classList.remove('dragging')
        console.log("Draggable item: Stop dragging")
    })
})

// enough for movement
containers.forEach(a_container => {
    a_container.addEventListener('dragover', (the_cursor) => {
        the_cursor.preventDefault()
        console.log("Container dragged over")

        const a_draggable_shadow = document.querySelector('.dragging')
        a_container.appendChild(a_draggable_shadow)
    })
})