/*= <ABOUT!> ============================================================
???
It is recommended to jump with `Ctrl + F`.

It is split into 6 categories:
- global variables      : (global variable initialization)
- global function calls : (initializes behavior when the page is loaded)
- initializer functions : (initializes or reinitializes a behavior)
- behavioral functions  : (functions...)
- common functions      : (functions that can be used over and over, for
                           ... making life easier)
- element constructors  : (functions that create elements)
=======================================================================*/

//TO DO:
// fix the close buttons

/*=======================================================================
GLOBAL VARIABLES
=======================================================================*/
const calendar_slots = document.querySelectorAll('.calendar-slot')
const tasklist_slots = document.querySelectorAll('.task-list')
const node_slots = document.querySelectorAll('.matrix-slots-container')
const identifier_prefix = 'ID'
let next_identifier = 1 //new

/*=======================================================================
GLOBAL FUNCTION CALLS
=======================================================================*/

// tasks
initialize_task_behavior() 
initialize_calendar_slots()
initialize_tasklist_slots()
initialize_close_button_behavior()

// nodes
initialize_node_drag_behavior()
initialize_node_slots() 
refresh_node_order()

/*=======================================================================
INITIALIZER FUNCTIONS
=======================================================================*/
function initialize_task_behavior() {
    /*=======================================================================
    Function to initialize or reinitialize task movement (and task shadow), 
    and task resize handle.
    About task drag and drop, and task resizing.
    =======================================================================*/
    let tasks = document.querySelectorAll(".task");
    const snap_height = 30; // The snap interval (in pixels)

    tasks.forEach((task) => {
        // For each task, select resize handle of the task
        const task_resize_handle = task.querySelector(".resize-handle")
        const task_drag_and_drop_handle = task.querySelector(".drag-and-drop-handle")
        let resizing = false

        // Mouse down event to start resizing
        task_resize_handle.addEventListener("mousedown", (the_cursor) => {
            resizing = true

            // Change cursor style
            document.body.style.cursor = "ns-resize" 

            // Get initial mouse position (to later on calculate delta_Y)
            const initial_mouse_Y = the_cursor.clientY

            // Get initial task height and change it to base 10 (remove trailing 'px')
            const initial_task_height = parseInt(window.getComputedStyle(task).height, 10)

            // Mouse move event function to resize the task
            const mouse_move_event_handler = (move_event_cursor) => {
                if (resizing) {
                    // Get mouse position and calculate difference from starting mouse position
                    const new_mouse_Y = move_event_cursor.clientY
                    const delta_Y = new_mouse_Y - initial_mouse_Y

                    // Resize according to mouse position
                    let new_task_height = initial_task_height + delta_Y

                    // Snap the height to the nearest multiple of snap_height
                    new_task_height = Math.round(new_task_height / snap_height) * snap_height

                    // However, if new_task_height computed is a negative value, change it 
                    // ... to minimum value (that is snap_height)
                    if (new_task_height < snap_height) {
                        new_task_height = snap_height
                    }

                    // Apply the snapped height
                    task.style.height = new_task_height + "px"
                }
            }

            // Mouse up event function to stop resizing
            const mouse_up_event_handler = () => {
                resizing = false
                document.removeEventListener("mousemove", mouse_move_event_handler)
                document.removeEventListener("mouseup", mouse_up_event_handler)

                // Reset cursor style
                document.body.style.cursor = "" 
            }

            // Add the functions in
            document.addEventListener("mousemove", mouse_move_event_handler)
            document.addEventListener("mouseup", mouse_up_event_handler)
        })

        // Task drag and drop handle
        task_drag_and_drop_handle.addEventListener('dragstart', () => {
            task.classList.add('task-dragging')
        })
        task_drag_and_drop_handle.addEventListener('dragend', () => {
            task.classList.remove('task-dragging')
        })

    })
}

function initialize_calendar_slots() {
    /*=======================================================================
    Function to initialize or reinitialize calendar slots for dropping task
    items on it. A calendar slot can only accepts one task.
    =======================================================================*/

    calendar_slots.forEach(a_container => {
        a_container.addEventListener('dragover', (the_cursor) => {
            the_cursor.preventDefault()
            console.log("Draggable object dragged over calendar") // for testing
    
            // You can place an task only if there's no task in the slot.
            if (a_container.childElementCount === 0) {
                
                const being_dragged = document.querySelector('.task-dragging')
                task_on_calendar(being_dragged)
                a_container.appendChild(being_dragged)
                console.log('yes')
                
            }
        })
    })
}

function initialize_tasklist_slots() {
    /*=======================================================================
    Function to initialize or reinitialize the tasklist for dropping task
    items on it. The tasklist can accept any number of tasks.
    =======================================================================*/
    tasklist_slots.forEach(a_container => {
        a_container.addEventListener('dragover', (the_cursor) => {
            the_cursor.preventDefault()
            console.log("Draggable object dragged over tasklist") // for testing
            const being_dragged = document.querySelector('.task-dragging')
            task_on_tasklist(being_dragged)
            a_container.appendChild(being_dragged)

            // remove custom height property and use the calendar format
            being_dragged.style.height = "" 
        })
    })
}

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
}

function initialize_node_slots() {
    /*=======================================================================
    Function to initialize or reinitialize the node containers for dropping 
    node items on it. The node container can accept any number of nodes.
    =======================================================================*/

    // Give the containers an event listener to when something is dragged over it
    node_slots.forEach(a_container => {
        a_container.addEventListener('dragover', (the_cursor) => {

            // So that the cursor can change into the drag-cursor icon
            the_cursor.preventDefault()

            // If node being dragged is not the first element in the container, 
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

            // Reset x, y within the task 
            try {
                // get x, y while removing the 'X' or 'Y' prefix from 'X1', 'X2', ...
                let container_X = find_class_with_prefix(a_container, 'X')
                let container_Y = find_class_with_prefix(a_container, 'Y')

                // get the node's identifier
                const task_identifier = ".ID" + find_class_with_prefix(being_dragged, 'ID')

                // access the task associated with the identifier
                const selected_elements = document.querySelectorAll(task_identifier)
                let selected_task = undefined
                selected_elements.forEach(an_element => {
                    if (an_element.classList.contains('task')) {
                        selected_task = an_element
                    }
                })

                // update selected task
                let selected_task_X = get_inner_element_by_class(selected_task, 'task-difficulty')
                let selected_task_Y = get_inner_element_by_class(selected_task, 'task-impact')
                selected_task_X.textContent = container_X
                selected_task_Y.textContent = container_Y
            }
            catch(error) {
                console.log("Not a real node connected to a task. Dummy (/test) node.")
            }
        })
    })
}

function refresh_node_order() {
    /*=======================================================================
    Function to initialize or reinitialize node order, so that the first
    element have the default margin, and the rest has negative margin.
    =======================================================================*/
    node_slots.forEach(a_container => {
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
            const identifier_to_nuke = "." + identifier_prefix + find_class_with_prefix(parent_task, identifier_prefix) // access the ID

            // Remove elements with class=ID{num}
            const elements_to_nuke = document.querySelectorAll(identifier_to_nuke)
            elements_to_nuke.forEach(an_element => {
                an_element.parentNode.removeChild(an_element)
            })

            // Refresh
            refresh_node_order()
        })
    })
}

/*=======================================================================
BEHAVIORAL FUNCTIONS
=======================================================================*/

function task_on_calendar(draggable_task) {
    /*=======================================================================
    Function to change the formatting of a task object when hovered over any
    calendar slot. Only visually important features remain.
    =======================================================================*/
    console.log("HEY:", draggable_task)

    try {
        draggable_task.classList.remove('task-list-format')
        draggable_task.classList.add('calendar-format')
    }
    catch {}

    // disable some features
    const disappearing_description = get_inner_element_by_class(draggable_task, 'task-body')
    disappearing_description.classList.add('hidden')

    // enable some features
    const disappearing_footer = get_inner_element_by_class(draggable_task, 'resize-handle')
    disappearing_footer.classList.remove('hidden')
}

function task_on_tasklist(draggable_task) {
    /*=======================================================================
    Function to change the formatting of a task object when hovered over the
    task-list.
    =======================================================================*/
    try {
        draggable_task.classList.remove('calendar-format')
        draggable_task.classList.add('task-list-format')
    } catch {}

    // enable some features
    const disappearing_description = get_inner_element_by_class(draggable_task, 'task-body')
    disappearing_description.classList.remove('hidden')

    // disable some features
    const disappearing_footer = get_inner_element_by_class(draggable_task, 'resize-handle')
    disappearing_footer.classList.add('hidden')
}

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
    initialize_node_slots()
    refresh_node_order()

    // Reinitialize because we have a new task
    initialize_task_behavior()

    // reinitialize close buttons because we have a new task
    initialize_close_button_behavior() 
}

/*=======================================================================
COMMON FUNCTIONS
=======================================================================*/

function find_class_with_prefix (an_element, prefix) {
    /*=======================================================================
    Function find an element's class prefix and return the associated value 
    only (without the prefix). For example, ID123 -> 123, X4 -> 4. 
    Undefined is returned when it fails to get a class with a prefix.
    =======================================================================*/
    const class_list = an_element.classList
    const prefix_length = prefix.length
    let value = undefined
    class_list.forEach(a_class => {
        let a_class_prefix = a_class.slice(0, prefix_length)
        try {
            if (a_class_prefix === prefix) {
                value = a_class.slice(prefix_length, an_element.length)
                return value
            }
        } catch { } // the class name is not long enough
    }) 
    return value
}

function get_inner_element_by_class (an_element, class_name) {
    /*=======================================================================
    Function find an element's class prefix and return the associated value 
    only (without the prefix). For example, ID123 -> 123, X4 -> 4. 
    Undefined is returned when it fails to get a class with a prefix.
    =======================================================================*/

    // If the element itself has the target class, return it
    if (an_element.classList.contains(class_name)) {
        return an_element
    }
  
    // Iterate through the element's children
    for (let i = 0; i < an_element.children.length; i++) {
        const child = an_element.children[i]
    
        // Recursively search within each child
        const result = get_inner_element_by_class (child, class_name)
        if (result) {
            return result;
        }
    }
  
    // If no match is found, return null
    return null;
}

/*=======================================================================
ELEMENT CONSTRUCTORS
=======================================================================*/

function new_tasklist_item(input_task_name, input_task_difficulty, input_task_impact, input_task_description) {
    /*=======================================================================
    Function to make a draggable task list item
    =======================================================================*/
    const new_task_title = document.createElement('p')
    new_task_title.classList.add('task-title')
    new_task_title.textContent = input_task_name
    const new_task_delete_button = document.createElement('button')
    new_task_delete_button.classList.add('close-button')
    new_task_delete_button.textContent = 'X'

    const new_task_header = document.createElement('div')
    new_task_header.classList.add('task-header')
    new_task_header.appendChild(new_task_title)
    new_task_header.appendChild(new_task_delete_button)


    const new_task_difficulty = document.createElement('p')
    new_task_difficulty.classList.add('task-difficulty')
    new_task_difficulty.textContent = input_task_difficulty

    const new_task_difficulty_capsule = document.createElement('div')
    new_task_difficulty_capsule.classList.add('task-difficulty-capsule')
    new_task_difficulty_capsule.appendChild(new_task_difficulty)

    const new_task_impact = document.createElement('p')
    new_task_impact.classList.add('task-impact')
    new_task_impact.textContent = input_task_impact

    const new_task_impact_capsule = document.createElement('div')
    new_task_impact_capsule.classList.add('task-impact-capsule')
    new_task_impact_capsule.appendChild(new_task_impact)

    const new_task_info = document.createElement('div')
    new_task_info.classList.add('task-info')
    new_task_info.appendChild(new_task_impact_capsule)
    new_task_info.appendChild(new_task_difficulty_capsule)
    
    const new_task_description = document.createElement('p')
    new_task_description.textContent = input_task_description
    
    const new_task_body = document.createElement('div')
    new_task_body.classList.add('task-body')
    new_task_body.appendChild(new_task_description)

    const new_task_dragdrop_handle = document.createElement('div')
    new_task_dragdrop_handle.classList.add('drag-and-drop-handle')
    new_task_dragdrop_handle.setAttribute('draggable', 'true')
    new_task_dragdrop_handle.appendChild(new_task_header)
    new_task_dragdrop_handle.appendChild(new_task_info)
    new_task_dragdrop_handle.appendChild(new_task_body)


    const new_task_footer = document.createElement('div')
    new_task_footer.classList.add('resize-handle')

    const new_task = document.createElement('div')
    new_task.classList.add('task')
    new_task.classList.add('task-list-format')
    new_task.classList.add(identifier_prefix + next_identifier.toString()) // global var
    new_task.appendChild(new_task_dragdrop_handle)
    new_task.appendChild(new_task_footer)

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