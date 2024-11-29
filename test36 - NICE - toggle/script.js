function initialize_month_week_toggle_behavior () {
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

initialize_month_week_toggle_behavior ()