// This is AI code, sorry Hanina.
const slider = document.getElementById("myRange");

slider.addEventListener("input", () => {
    // You can use the slider value here to update other elements or trigger actions
    const sliderValue = slider.value;
    console.log("Slider value:", sliderValue);

    // Example: Update a text element with the slider value
    const valueDisplay = document.getElementById("valueDisplay");
    valueDisplay.textContent = sliderValue;
});