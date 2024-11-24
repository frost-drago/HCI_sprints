// https://www.youtube.com/watch?v=jfYWwQrtzzY

// TO DO
// refresh nodes that are not the first child in making elements

const node_containers = document.querySelectorAll('.matrix-slots-container')
const identifier_prefix = 'ID'
let next_identifier = 1 //new

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
            // ... add negative margin (in class more-points). this behavior is for
            // ... when dragging.
            const being_dragged = document.querySelector('.dragging')
            const parent_container = being_dragged.parentElement
            if (being_dragged === parent_container.children[0]) {
                a_container.appendChild(being_dragged) // move node here
                being_dragged.classList.remove('more-points')
            } else {
                a_container.appendChild(being_dragged) // move node here
                being_dragged.classList.add('more-points')
            }
            refresh_node_order()

            // reset x, y within the task
            try {
                // get x, y while removing the 'X' or 'Y' prefix from 'X1', 'X2', ...
                let container_X = a_container.classList[1].split('X')[1]
                let container_Y = a_container.classList[2].split('Y')[1]

                // get the node rather than the container
                const task_identifier = "." + being_dragged.classList[2]

                // access the task associated with the identifier
                const selected_task = document.querySelectorAll(task_identifier)[1]

                // update selected task
                let selected_task_X = selected_task.children[0].children[1]
                let selected_task_Y = selected_task.children[0].children[2]
                selected_task_X.textContent = container_X
                selected_task_Y.textContent = container_Y
            }
            catch(error) {
                console.log("SELECTED NODE IS NOT VALID") // used to see remaining nodes
            }
        })
    })
}

function refresh_node_order() {
    /*=======================================================================
    Function to initialize or reinitialize node order, so that the first
    element have the default margin, and the rest has negative margin.
    =======================================================================*/
    node_containers.forEach(a_container => {
        try {
            a_container.children[0].classList.remove('more-points')
            for (let i = 1; i < a_container.children.length; i++) {
                a_container.children[i].classList.add('more-points');
            }
        }
        catch { } // everything is ordered
    })
}

function initialize_close_button_behavior() {
    /*=======================================================================
    Function to initialize or reinitialize close button behavior. 
    Deletes both the task and the node when clicked.
    =======================================================================*/
    // Get all close buttons
    let task_close_buttons = document.querySelectorAll('.close-button')
    console.log("My buttons:", task_close_buttons) //testing
    task_close_buttons.forEach(a_close_button => {
        a_close_button.addEventListener('click', () => {

            // Get the task identifier from the task
            const parent_task = a_close_button.parentElement.parentElement
            const identifier_to_nuke = "." + parent_task.classList[2] // access the ID

            // Remove elements with class=ID{num}
            const elements_to_nuke = document.querySelectorAll(identifier_to_nuke)
            console.log(elements_to_nuke)
            elements_to_nuke.forEach(an_element => {
                an_element.parentNode.removeChild(an_element)
            })

            // Refresh
            refresh_node_order()
        })
    })
}

initialize_node_drag_behavior() // do at least once
initialize_close_button_behavior() // do at least once
refresh_node_order()

function add_task() {
    /*=======================================================================
    Function to that gets called when you add a task
    =======================================================================*/

    // Get info
    const input_task_name = document.getElementById('task-name').value;
    const input_task_difficulty = parseInt(document.getElementById('difficulty').value);
    const input_task_impact = parseInt(document.getElementById('impact').value);
    const input_task_description = document.getElementById('task-description').value;

    // Get the selected color: blue, green, or red
    const color_radios = document.getElementsByName('color');
    let input_color;
    for (const a_radio of color_radios) {
        if (a_radio.checked) {
            input_color = a_radio.value;
            break;
        }
    }

    // Create task
    new_tasklist_item(input_task_name, input_task_difficulty, input_task_impact, input_task_description)

    // Create node
    new_node(input_task_name, input_color, input_task_difficulty, input_task_impact)

    // Update next_identifier
    next_identifier++
    console.log(next_identifier)

    // Reinitialize because we have a new node
    initialize_node_drag_behavior()
    refresh_node_order()

    // reinitialize close buttons because we have a new task
    initialize_close_button_behavior() 
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
    new_task_delete_button.classList.add('close-button')
    new_task_delete_button.textContent = 'X'

    const new_task_body = document.createElement('div')
    new_task_body.classList.add('task-body')
    new_task_body.appendChild(new_task_description)
    new_task_body.appendChild(new_task_delete_button)

    const new_task = document.createElement('div')
    new_task.classList.add('task-item')
    new_task.classList.add('task-list-format')
    new_task.classList.add(identifier_prefix + next_identifier.toString()) // global var
    new_task.setAttribute('draggable', 'true')
    new_task.appendChild(new_task_header)
    new_task.appendChild(new_task_body)

    const task_container = document.querySelectorAll('.task-list')
    task_container[0].appendChild(new_task)
}

function new_node(input_task_name, input_color, input_task_difficulty, input_task_impact) {
    /*=======================================================================
    Function to make a draggable node item
    input_task_difficulty   = X position
    input_task_impact       = Y position
    =======================================================================*/
    const new_p = document.createElement('p')
    new_p.textContent = input_task_name

    const new_node = document.createElement('div')
    new_node.classList.add('draggable-node')
    new_node.classList.add(input_color)
    new_node.classList.add(identifier_prefix + next_identifier.toString()) // global var
    new_node.setAttribute('draggable', 'true')
    new_node.appendChild(new_p)

    // Add node to the appropriate container based on (difficulty, impact) as (X, Y)
    class_locator_difficulty = '.X' + input_task_difficulty.toString()
    class_locator_impact = '.Y' + input_task_impact.toString()
    const selected_container = document.querySelectorAll(class_locator_difficulty + class_locator_impact);
    selected_container[0].appendChild(new_node)
}
