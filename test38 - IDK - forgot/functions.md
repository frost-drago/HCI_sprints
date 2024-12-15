# Script.js

## Global variables

* const month_names
* const month_names_shorthand
* const day_names
* let calendar_slots=document.querySelectorAll('.calendar-slot')
* const tasklist_slots=document.querySelectorAll('.task-list')
* const node_slots=document.querySelectorAll('.matrix-slots-container')
* const identifier_prefix='ID'
* let next_identifier = 1
* let current_date = new Date() // current date for global var (for switching between weeks)
* let ***current_week*** = get_week_range(current_date) // Get the start and end dates of the current week (no)
* let ***current_week_detailed*** = get_week_range(current_date)
* let ***today_date*** = newDate() // actual now

## Initializer functions

* initialize_task_behavior()
* initialize_calendar_slots()
* initialize_tasklist_slots()
* initialize_node_drag_behavior()
* initialize_node_slots()
* refresh_node_order()
* unbold_matrix_labels()
* initialize_close_button_behavior()
* initialize_month_week_toggle_behavior()
* initialize_header_week_month()
* initialize_task_time(a_task)
* calculate_task_priority()
* initialize_tasklist_order()

## Behavioral functions

* task_on_calendar(draggable_task)
* task_on_tasklist(draggable_task)
* add_task()

## Common functions

* ***find_class_with_prefix** (an_element, prefix)*
* ***get_inner_element_by_class** (an_element, class_name)*
* are_dates_equal(date_1, date_2)
* get_date_suffix(date)
* ***get_week_range(date)***
* ***get_week_range_per_day(date)***
* change_week(direction)
* ***get_day_date_string(a_date)***

## Element constructors

* new_weekly_calendar(max_slots)
* new_tasklist_item(input_task_name, input_task_difficulty, input_task_impact, input_task_description, input_color)
* new_node(input_task_name, input_color, input_task_difficulty, input_task_impact)

## Not done yet

save_all_task
