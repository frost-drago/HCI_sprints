// https://www.youtube.com/watch?v=jfYWwQrtzzY


const containers = document.querySelectorAll('.container')

console.log("Hello")

function initialize_draggables() {

    let draggable_items = document.querySelectorAll('.draggable-item')

    // Dragging behavior, like... drag shadow
    draggable_items.forEach(a_draggable => {
        a_draggable.addEventListener('dragstart', () => {
            a_draggable.classList.add('dragging')
            console.log("Draggable item: Start dragging")
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
            //console.log("Container dragged over")

            const being_dragged = document.querySelector('.dragging')
            // console.log(being_dragged)
            const parent_container = being_dragged.parentElement
            if (being_dragged === parent_container.children[0]) {
                a_container.appendChild(being_dragged)
                being_dragged.classList.remove('more-points')
            } else {
                a_container.appendChild(being_dragged)
                being_dragged.classList.add('more-points')
            }
            parent_container.children[0].classList.remove('more-points') //added
            
        })
    })

}

initialize_draggables() // do at least once

function add_task() {
    // Create circle
    const new_circle = document.createElement('div')
    const new_p = document.createElement('p')
    new_p.textContent = "new"
    new_circle.classList.add('draggable-item')
    new_circle.setAttribute('draggable', 'true')
    new_circle.appendChild(new_p)

    // Test
    console.log(new_circle)                 //
    console.log(containers[0])              //
    console.log("Button is clicked!")

    // Add circle to container
    containers[0].appendChild(new_circle)

    // Reinitialize 
    initialize_draggables()
}