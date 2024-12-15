// This slider is AI code, sorry Hanina.
const slider = document.getElementById("myRange");

slider.addEventListener("input", () => {
    // You can use the slider value here to update other elements or trigger actions
    const sliderValue = slider.value;
    console.log("Slider value:", sliderValue);

    // Example: Update a text element with the slider value
    const valueDisplay = document.getElementById("valueDisplay");
    valueDisplay.textContent = sliderValue;
});

// Toggle settings
const settings_button = document.getElementById('settings-button')

settings_button.addEventListener('click', () => {
    const settings_interface = document.getElementById('settings-page')
    settings_interface.style.visibility = 'visible'
})

const settings_close_button = document.getElementById('settings-close-button')

settings_close_button.addEventListener('click', () => {
    const settings_interface = document.getElementById('settings-page')
    settings_interface.style.visibility = 'hidden'
})

// Toggle account page

const account_button = document.getElementById('account-button')

account_button.addEventListener('click', () => {
    const account_interface = document.getElementById('account-page')
    account_interface.style.visibility = 'visible'
})

const account_close_button = document.getElementById('account-close-button')

account_close_button.addEventListener('click', () => {
    const account_interface = document.getElementById('account-page')
    account_interface.style.visibility = 'hidden'
})