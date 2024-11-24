// https://www.youtube.com/watch?v=jfYWwQrtzzY

const relocatable_items = document.querySelectorAll('.relocatable-item')
const containers = document.querySelectorAll('.container')
const draggable_footers = document.querySelectorAll('.item-footer')

console.log("Hello")
console.log(draggable_footers)

// Dragging behavior, like... drag shadow
relocatable_items.forEach(a_relocatable => {
    // access .draggable-title
    const a_draggable_handle = a_relocatable.children[0]

    // can only relocate if you drag the title
    a_draggable_handle.addEventListener('dragstart', () => {
        a_relocatable.classList.add('dragging')
        console.log("Draggable item: Start dragging")
    })

    a_draggable_handle.addEventListener('dragend', () => {
        a_relocatable.classList.remove('dragging')
        console.log("Draggable item: Stop dragging")
    })
})

let start_drag_point = undefined
// For footers
draggable_footers.forEach(a_footer => {
    a_footer.addEventListener('dragstart', () => {
        a_relocatable.classList.add('resizing')
        console.log("Draggable footer: Start resizing")
    })

    a_footer.addEventListener('dragend', () => {
        a_relocatable.classList.remove('resizing')
        console.log("Draggable footer: Stop resizing")
    })
})

// enough for movement
containers.forEach(a_container => {
    a_container.addEventListener('dragover', (the_cursor) => {
        the_cursor.preventDefault()
        //console.log("Container dragged over")

        // normal item
        try {
            const a_draggable_shadow = document.querySelector('.dragging')
            a_container.appendChild(a_draggable_shadow)
        } catch (error) {
            //console.log("thing doesn't have .dragging class")
        }

        // footer item (if footer item dragged)
        try {
            const something = document.querySelector('.resizing')
            if (a_container.childElementCount === 0) {
                const new_trailing = build_trailing_item()
                a_container.appendChild(new_trailing)
            }
        } catch {}
    })

    a_container.addEventListener('dragleave', () => {
        const something = document.querySelector('.resizing')
        try {
            if (a_container.childElementCount >= 1) {
                const trailing_item = get_inner_element_by_class(a_container, 'item-trailing')
                trailing_item.remove()
            }
        } catch {}
    }) 
})

function build_trailing_item() {
    const new_trailing = document.createElement('div')
    new_trailing.classList.add('item-trailing')
    return new_trailing
}

/*
function get_inner_element_by_class (an_element, class) {

}*/

// copied from AI
function get_inner_element_by_class (an_element, class_name) {
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


// copied :v :P
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