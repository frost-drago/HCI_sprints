//TO DO:
// merge with main
// add time

const tasks = document.querySelectorAll(".task");
const snap_height = 60; // The snap interval (in pixels)

tasks.forEach((task) => {
    // For each task, select resize handle of the task
    const task_resize_handle = task.querySelector(".resize-handle");
    let resizing = false;

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
})
