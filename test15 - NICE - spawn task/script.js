// https://www.youtube.com/watch?v=jfYWwQrtzzY


const node_containers = document.querySelectorAll('.matrix-slots-container')

console.log("Hello")

function initialize_node_drag_behavior() {
    /*=======================================================================
    Function to initialize or reinitialize node movement, and node shadow.
    About node drag and drop.
    =======================================================================*/

    // Get all nodes
    let draggable_nodes = document.querySelectorAll('.draggable-node')

    // Give the nodes an event listener
    draggable_nodes.forEach(a_node => {
        // When drag start, opacity 50% (in class dragging)
        a_node.addEventListener('dragstart', () => {
            a_node.classList.add('dragging')
        })

        // When drag ends, return to original opacity
        a_node.addEventListener('dragend', () => {
            a_node.classList.remove('dragging')
        })
    })

    // Give the containers an event listener to when something is dragged over it
    node_containers.forEach(a_container => {
        a_container.addEventListener('dragover', (the_cursor) => {

            // so that the cursor can change into the drag-cursor icon
            the_cursor.preventDefault()

            // if node being dragged is not the first element in the container, 
            // ... add negative margin (in class more-points)
            const being_dragged = document.querySelector('.dragging')
            const parent_container = being_dragged.parentElement
            if (being_dragged === parent_container.children[0]) {
                a_container.appendChild(being_dragged) // move node here
                being_dragged.classList.remove('more-points')
            } else {
                a_container.appendChild(being_dragged) // move node here
                being_dragged.classList.add('more-points')
            }
            try {
                parent_container.children[0].classList.remove('more-points')
            }
            catch(error) {
                console.log("First node already doesn't have `.more-points`")
            }
        })
    })
}

initialize_node_drag_behavior() // do at least once

function add_task() {
    /*=======================================================================
    Function to that gets called when you add a task
    =======================================================================*/

    // Get info
    const input_task_name = document.getElementById('task-name').value;
    const input_task_difficulty = parseInt(document.getElementById('difficulty').value);
    const input_task_impact = parseInt(document.getElementById('impact').value);
    const input_task_description = document.getElementById('task-description').value;

    // Get the selected color
    const colorRadios = document.getElementsByName('color');
    let selectedColor;
    for (const radio of colorRadios) {
        if (radio.checked) {
            selectedColor = radio.value;
            break;
        }
    }

    // Test
    console.log(input_task_name)
    console.log(input_task_difficulty)
    console.log(input_task_impact)


    // Create task
    new_tasklist_item(input_task_name, input_task_difficulty, input_task_impact, input_task_description)

    // Create node
    const new_p = document.createElement('p')
    new_p.textContent = input_task_name

    const new_node = document.createElement('div')
    new_node.classList.add('draggable-node')
    new_node.setAttribute('draggable', 'true')
    new_node.appendChild(new_p)

    // Add node to container
    node_containers[0].appendChild(new_node)

    // Reinitialize because we have a new node
    initialize_node_drag_behavior()
}

function new_tasklist_item(input_task_name, input_task_difficulty, input_task_impact, input_task_description) {
    /*=======================================================================
    Function to make a draggable task list item
    =======================================================================*/
    const new_task_title = document.createElement('p')
    new_task_title.classList.add('task-title')
    new_task_title.textContent = input_task_name
    const new_task_difficulty = document.createElement('p')
    new_task_difficulty.classList.add('task-difficulty')
    new_task_difficulty.textContent = input_task_difficulty
    const new_task_impact = document.createElement('p')
    new_task_impact.classList.add('task-impact')
    new_task_impact.textContent = input_task_impact

    const new_task_header = document.createElement('div')
    new_task_header.classList.add('task-header')
    new_task_header.appendChild(new_task_title)
    new_task_header.appendChild(new_task_difficulty)
    new_task_header.appendChild(new_task_impact)

    const new_task_description = document.createElement('p')
    new_task_description.textContent = input_task_description
    const new_task_delete_button = document.createElement('button')
    new_task_delete_button.textContent = 'X'

    const new_task_body = document.createElement('div')
    new_task_body.classList.add('task-body')
    new_task_body.appendChild(new_task_description)
    new_task_body.appendChild(new_task_delete_button)

    const new_task = document.createElement('div')
    new_task.classList.add('task-item')
    new_task.classList.add('calendar-format')
    new_task.setAttribute('draggable', 'true')
    new_task.appendChild(new_task_header)
    new_task.appendChild(new_task_body)

    const task_container = document.querySelectorAll('.task-list')
    task_container[0].appendChild(new_task)
}