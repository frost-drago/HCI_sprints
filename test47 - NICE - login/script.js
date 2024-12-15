/*= <ABOUT!> ============================================================
All the JS file in one. I don't know how to split it into multiple files,
... hence the very long file. Sorry.
It is recommended to jump with `Ctrl + F`.

It is split into 6 categories:
- global variables      : (global variable initialization)
- global function calls : (initializes behavior when the page is loaded)
- initializer functions : (initializes or reinitializes a behavior)
- behavioral functions  : (functions that are triggered (eventListeners))
- common functions      : (functions that can be used over and over, for
                           ... making life easier)
- element constructors  : (functions that create elements)
=======================================================================*/


/*=======================================================================
GLOBAL VARIABLES
=======================================================================*/
const month_names = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
]
const month_names_shorthand = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

const day_names = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]

let calendar_slots = document.querySelectorAll('.calendar-slot')
const tasklist_slots = document.querySelectorAll('.task-list')
const node_slots = document.querySelectorAll('.matrix-slots-container')
const identifier_prefix = 'ID'
let next_identifier = 1 

let current_date = new Date() // current date for global var (for switching between weeks)
let current_week = get_week_range(current_date) // Get the start and end dates of the current week (no)
let current_week_detailed = get_week_range_per_day(current_date)

let today_date = new Date() // actual now

/*=======================================================================
GLOBAL FUNCTION CALLS
=======================================================================*/

// header
initialize_header_week_month()
initialize_month_week_toggle_behavior()

// calendar
new_weekly_calendar(48) //48 slots

// tasks
initialize_task_behavior() 
initialize_calendar_slots()
initialize_tasklist_slots()
initialize_close_button_behavior()
initialize_tasklist_order()

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

                // Update task start time and task length, for later saving it 
                initialize_task_time(task)
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
    
            // You can place an task only if there's no task in the slot.
            if (a_container.childElementCount === 0) {
                
                const being_dragged = document.querySelector('.task-dragging')
                task_on_calendar(being_dragged)
                a_container.appendChild(being_dragged)

                // Update task start time and task length, for later saving it 
                initialize_task_time(being_dragged)
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

            const being_dragged = document.querySelector('.task-dragging')
            task_on_tasklist(being_dragged)
            a_container.appendChild(being_dragged)

            // remove custom height property and use the calendar format
            being_dragged.style.height = "" 

            initialize_tasklist_order()
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
            unbold_matrix_labels()

            // also recalculate
            calculate_task_priority()
            initialize_tasklist_order()
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
                let selected_task_X = get_inner_element_by_class(selected_task, 'task-impact')
                let selected_task_Y = get_inner_element_by_class(selected_task, 'task-difficulty')
                selected_task_X.textContent = container_X
                selected_task_Y.textContent = container_Y

                // also, updates labels so they're bold
                let label_X = document.getElementById('label-X-' + container_X)
                label_X.classList.add('label-bold')
                let label_Y = document.getElementById('label-Y-' + container_Y)
                label_Y.classList.add('label-bold')
            }
            catch(error) {
                console.log("Not a real node connected to a task. Dummy (/test) node.")
            }
        })

        // also, updates labels so they're not bold
        a_container.addEventListener('dragleave', () => {
            try {
                let container_X = find_class_with_prefix(a_container, 'X')
                let container_Y = find_class_with_prefix(a_container, 'Y')
                let label_X = document.getElementById('label-X-' + container_X)
                label_X.classList.remove('label-bold')
                let label_Y = document.getElementById('label-Y-' + container_Y)
                label_Y.classList.remove('label-bold')
            } catch {}
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

function unbold_matrix_labels() {
    /*=======================================================================
    Function to reset matrix labels, resetting it to default style.
    =======================================================================*/
    const matrix_labels = document.querySelectorAll('.axis-label')
    matrix_labels.forEach(a_label => {
        try {
            a_label.children[0].classList.remove('label-bold')
        } catch {}
    })
}

function initialize_close_button_behavior() {
    /*=======================================================================
    Function to initialize or reinitialize close button behavior. 
    Deletes both the task and the node when clicked.
    =======================================================================*/
    // Get all close buttons
    let task_close_buttons = document.querySelectorAll('.close-button')
    task_close_buttons.forEach(a_close_button => {
        a_close_button.addEventListener('click', () => {

            // Get the task identifier from the task
            const parent_task = a_close_button.parentElement.parentElement.parentElement
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

function initialize_month_week_toggle_behavior() {
    /*=======================================================================
    Function to initialize change views between month and week (top)
    =======================================================================*/
    const toggle_week = document.querySelector('.toggle-week')
    const toggle_month = document.querySelector('.toggle-month')
    const toggle_button = document.querySelector('.calendar-view-toggle-button')

    toggle_week.addEventListener('click', () => {
        toggle_button.classList.add('moved-right')

        /* change text color */
        toggle_month.classList.remove('white-text')
        toggle_month.classList.add('black-text')
        toggle_week.classList.add('white-text')
        toggle_week.classList.remove('black-text')
    })

    toggle_month.addEventListener('click', () => {
        toggle_button.classList.remove('moved-right')

        /* change text color */
        toggle_month.classList.add('white-text')
        toggle_month.classList.remove('black-text')
        toggle_week.classList.remove('white-text')
        toggle_week.classList.add('black-text')
    })
}

function initialize_header_week_month() {
    /*=======================================================================
    Function to initialize or reinitialize header week and month display.
    =======================================================================*/

    const month_name = month_names[current_date.getMonth()]

    document.getElementById("month-name").textContent = month_name
    document.getElementById("week-start-date").textContent = month_names_shorthand[current_week.start.getMonth()] + " " + current_week.start.getDate() + get_date_suffix(current_week.start.getDate())
    document.getElementById("week-end-date").textContent = month_names_shorthand[current_week.end.getMonth()] + " " + current_week.end.getDate() + get_date_suffix(current_week.end.getDate())

    // Update header-week-labels
    let a_date = new Date(current_week.start)

    for (let i = 1; i <= 7; i++) {
        const header_label_date = document.getElementById(`header-label-date-${i}`)
        header_label_date.textContent = a_date.getDate()

        // Color current date
        if (are_dates_equal(a_date, today_date)) {
            header_label_date.parentElement.classList.add('today')
        }
        else {
            try {
                header_label_date.parentElement.classList.remove('today')
            } catch {} // the class doesn't exist
        }

        // Next iteration
        a_date.setDate(a_date.getDate() + 1)
    }
}

function initialize_task_time(a_task) {
    /*=======================================================================
    Function to initialize or reinitialize the start time of a task, and the
    duration of a task. Is for saving, and displaying time start and end for
    each task.
    =======================================================================*/

    // get position
    let parent_container = a_task.parentElement
    let start_time = find_class_with_prefix(parent_container, 'slot-')

    // put position in a hidden p 
    let task_start_time_p = get_inner_element_by_class(a_task, "task-start-time")
    task_start_time_p.textContent = start_time

    // put height in a hidden p
    let task_duration_p = get_inner_element_by_class(a_task, "task-duration")
    task_duration_p.textContent = a_task.clientHeight // Task duration is same as its height
}

function calculate_task_priority() {
    /*=======================================================================
    Function to initialize (calculate) or reinitialize (recalculate) the task
    priority the task priority display.
    =======================================================================*/
    const tasks = document.querySelectorAll('.task')

    tasks.forEach(a_task => {

        //get difficulty and impact
        
        let a_task_difficulty = get_inner_element_by_class(a_task, 'task-difficulty')
        let task_difficulty = a_task_difficulty.textContent
        
        let a_task_impact = get_inner_element_by_class(a_task, 'task-impact')
        let task_impact = a_task_impact.textContent

        //get deadline and relative to today

        //calculate priority
        let calculated_priority = (7 - parseInt(task_difficulty)) + (parseInt(task_impact) * 1.1)
        calculated_priority = calculated_priority.toFixed(1)
        let a_task_calculated_priority = get_inner_element_by_class(a_task, 'task-calculated-priority')
        a_task_calculated_priority.textContent = calculated_priority
    })  
}

function initialize_tasklist_order() {
    /*=======================================================================
    Function to initialize or reinitialize the order of tasks in the task 
    list. Sorts in descending order based on calculated priority.
    =======================================================================*/

    tasklist_slots.forEach(a_tasklist => {
        let tasks = Array.from(a_tasklist.querySelectorAll('.task'))

        // Sort the paragraphs based on their task-calculated-priority in a descending order
        tasks.sort((task_a, task_b) => {
            let task_a_priority = get_inner_element_by_class(task_a, 'task-calculated-priority')
            const num_a = parseFloat(task_a_priority.textContent)
            let task_b_priority = get_inner_element_by_class(task_b, 'task-calculated-priority')
            const num_b = parseFloat(task_b_priority.textContent)
            return num_b - num_a // Descending order
        })

        // Remove the original tasks from the task list
        tasks.forEach(a_task => a_task.remove())

        // Append the sorted tasks back to the task list
        tasks.forEach(a_task => a_tasklist.appendChild(a_task))
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

    // save?
    save_all_tasks ()
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
    new_tasklist_item(input_task_name, input_task_difficulty, input_task_impact, input_task_description, input_color)

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
    calculate_task_priority()
    initialize_tasklist_order()

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

function are_dates_equal(date_1, date_2) {
    /*=======================================================================
    Helper function to compare whether two dates are equal without factoring
    time.
    =======================================================================*/
    date_1.setHours(0, 0, 0, 0)
    date_2.setHours(0, 0, 0, 0)
    return date_1.getTime() === date_2.getTime()
}

function get_date_suffix(date) {
    /*=======================================================================
    Helper function to add suffixes to the day of the month 
    (e.g., 1st, 2nd, 3rd).
    =======================================================================*/
    if (date > 3 && date < 21) return "th"
    switch (date % 10) {
        case 1: return "st"
        case 2: return "nd"
        case 3: return "rd"
        default: return "th"
    }
}

function get_week_range(date) {
    /*=======================================================================
    Function to get the start and end dates for the week.
    =======================================================================*/
    const start_date = new Date(date)
    const end_date = new Date(date)

    // Calculate the start of the week (Monday)
    const day_num = start_date.getDay()
    start_date.setDate(start_date.getDate() - day_num + 1)

    // Calculate the end of the week (Sunday)
    end_date.setDate(start_date.getDate() + 6)
    
    return {start: start_date, end: end_date}
}

function get_week_range_per_day(date) {
    /*=======================================================================
    Function to get an array of 7 days for the week.
    =======================================================================*/

    const start_date = new Date(date);
    const day_num = start_date.getDay();
    start_date.setDate(start_date.getDate() - day_num + 1)

    const week_days = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(start_date)
        day.setDate(start_date.getDate() + i)
        week_days.push(day)
    }

    return week_days
}

function change_week(direction) {
    /*=======================================================================
    Function to change the current selected week (Prev or Next)
    direction : [integer] 1 is next week, -1 is last week, 2 is next 2 weeks,
                ... and so on.
    =======================================================================*/
    current_date.setDate(current_date.getDate() + direction * 7)
    current_week = get_week_range(current_date)
    current_week_detailed = get_week_range(current_date)
    initialize_header_week_month()
}

function get_day_date_string(a_date) {
    /*=======================================================================
    Function to get date in "dd-mm-yyyy" string format.
    =======================================================================*/

    const day_name = a_date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const date = a_date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
    //console.log(day_name) // Output: "saturday"
    //console.log(date) // Output: "11-30-2024"

    const [month, day, year] = a_date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/');
    const formatted_date = `${day}-${month}-${year}`;

    return formatted_date
    
}

/*=======================================================================
ELEMENT CONSTRUCTORS
=======================================================================*/

function new_weekly_calendar(max_slots) {
    /*=======================================================================
    Function to make a calendar.
    max_slots is the number of slots you want to have per day.
    =======================================================================*/
    const calendar_slots_container = document.querySelector('.calendar-container')

    // 1440 = 60 * 24 = length of the calendar 
    const time_slot_size_in_mins = 1440 / max_slots

    for (let day = 0; day < 7; day++) {
        const day_div = document.createElement('div')
        day_div.classList.add('day')
        day_div.classList.add('day-' + day_names[day])
        day_div.classList.add('date-' + get_day_date_string(current_week_detailed[day]))

        let slot_start_time_in_mins = 0

        for (let slot = 0; slot < max_slots; slot++) {
            const slot_div = document.createElement('div')
            slot_div.classList.add('calendar-slot')
            slot_div.classList.add('slot-' + slot_start_time_in_mins.toString())

            slot_start_time_in_mins += time_slot_size_in_mins

            day_div.appendChild(slot_div)
        }

        calendar_slots_container.appendChild(day_div)
    }

    // reinitialize calendar slots behavior
    calendar_slots = document.querySelectorAll('.calendar-slot')
    initialize_calendar_slots()
}

function new_tasklist_item(input_task_name, input_task_difficulty, input_task_impact, input_task_description, input_color) {
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

    const new_task_start_time = document.createElement('p')
    new_task_start_time.classList.add('task-start-time')
    const new_task_duration = document.createElement('p')
    new_task_duration.classList.add('task-duration')
    const new_task_calculated_priority = document.createElement('p')
    new_task_calculated_priority.classList.add('task-calculated-priority')

    const new_task_info = document.createElement('div')
    new_task_info.classList.add('task-info')
    new_task_info.appendChild(new_task_impact_capsule)
    new_task_info.appendChild(new_task_difficulty_capsule)
    new_task_info.appendChild(new_task_start_time)
    new_task_info.appendChild(new_task_duration)
    new_task_info.appendChild(new_task_calculated_priority)
    
    const new_task_description = document.createElement('p')
    new_task_description.classList.add('task-description')
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
    new_task_footer.classList.add('hidden')

    const new_task = document.createElement('div')
    new_task.classList.add('task')
    new_task.classList.add('task-list-format')
    new_task.classList.add('color-' + input_color)
    new_task.classList.add(identifier_prefix + next_identifier.toString()) // global var
    new_task.appendChild(new_task_dragdrop_handle)
    new_task.appendChild(new_task_footer)

    const task_container = document.querySelectorAll('.task-list')
    task_container[0].appendChild(new_task)
}

function new_node(input_task_name, input_color, input_task_difficulty, input_task_impact) {
    /*=======================================================================
    Function to make a draggable node item.
    input_task_difficulty   = Y position
    input_task_impact       = X position
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
    class_locator_difficulty = '.Y' + input_task_difficulty.toString()
    class_locator_impact = '.X' + input_task_impact.toString()
    const selected_container = document.querySelectorAll(class_locator_difficulty + class_locator_impact);
    selected_container[0].appendChild(new_node)
}

// ???
// ???
// ???



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
    const currentMonth = current_date.getMonth();
    const currentYear = current_date.getFullYear();
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
            const isToday = day === current_date.getDate() && currentMonth === current_date.getMonth() && currentYear === current_date.getFullYear();
            calendarHTML += `<div class="calendar-day${isToday ? " current-day" : ""}">${day}</div>`;
        }
        if ((index + 1) % 7 === 0) {
            calendarHTML += '</div><div class="calendar-days">';
        }
    });

    calendarHTML += '</div>';
    calendarContent.innerHTML = calendarHTML;

    // DEL LATER, for testing
    load_all_tasks()
}

// THIS
// lulz



function save_all_tasks () {
    let this_week = document.querySelectorAll('.day')
    let data  = {} // load data
    this_week.forEach(a_day => {
        let this_week_tasks = a_day.querySelectorAll('.task')
        let this_week_tasks_converted = []

        // if undefined then task list
        this_week_tasks.forEach(a_task => {
            // get ID of task
            const a_task_identifier = find_class_with_prefix(a_task, 'ID')
            // get start time
            const a_task_start_time = get_inner_element_by_class(a_task, "task-start-time").textContent
            // get duration
            const a_task_duration = get_inner_element_by_class(a_task, "task-duration").textContent

            // get task name
            const a_task_title = get_inner_element_by_class(a_task, "task-title").textContent
            // get difficulty
            const a_task_difficulty = get_inner_element_by_class(a_task, "task-difficulty").textContent
            // get impact
            const a_task_impact = get_inner_element_by_class(a_task, "task-impact").textContent
            // get due date
            // get description
            const a_task_description = get_inner_element_by_class(a_task, "task-description").textContent

            // get color
            const a_task_color = find_class_with_prefix(a_task, 'color-')

            console.log(a_task_identifier, a_task_start_time, a_task_duration, a_task_title, a_task_impact, a_task_difficulty, a_task_description, a_task_color)
            const task_object = {
                identifier: a_task_identifier,
                startTime: a_task_start_time,
                duration: a_task_duration,
                title: a_task_title,
                impact: a_task_impact,
                difficulty: a_task_difficulty,
                description: a_task_description,
                color: a_task_color
            }

            this_week_tasks_converted.push(task_object)
        })

        data[find_class_with_prefix(a_day, 'date-')] = this_week_tasks_converted
    })
    
    console.log(data)

    // Convert the list to a JSON string
    const week_info_json_string = JSON.stringify(data)

    // Store the JSON string in local storage
    localStorage.setItem('data_week_info', week_info_json_string)
    localStorage.setItem('data_current_identifier', next_identifier)
}

function load_all_tasks (week_start) {
    try {
        // Retrieve the JSON string from local storage
        const week_info_json_string = localStorage.getItem('data_week_info')
        next_identifier = localStorage.getItem('data_current_identifier')

        // Parse the JSON string back into a JavaScript array
        const week_info = JSON.parse(week_info_json_string)

        // Get current week start
        // eliminate all tasks on calendar
    } catch {}
    
}
