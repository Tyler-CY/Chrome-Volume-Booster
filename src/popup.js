// Variable for volume percentage
let volumePercentage = chrome.storage.sync.get('volumePercentage', ({ volumePercentage }) => {
    // Set the default value of the volume slider
    document.getElementById("volumeSlider").value = volumePercentage;
    // Set the default value of the volume slider output text
    document.getElementById("output").textContent = volumePercentage + "%";
});

// Initialize input action of the slide bar
document.getElementById("volumeSlider").addEventListener("input", setSliderOutputValue);
// Set up the confirm button response
document.getElementById("confirmButton").addEventListener("click", handleConfirmButton);
// Set up the reset button response
document.getElementById("resetButton").addEventListener("click", handleResetButton);


// Show the slider value in the HTML page.
function setSliderOutputValue() {
    // Update the variables
    volumePercentage = document.getElementById("volumeSlider").value;
    // Update popup.html
    document.getElementById("output").textContent = volumePercentage + "%";
    document.getElementById("confirmMessage").textContent = "";
    chrome.storage.sync.set({ volumePercentage });
}

// Sends a message to content.js to request adjustment of volume.
function handleConfirmButton() {
    document.getElementById("confirmMessage").textContent = "Settings Applied!";
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                message: "adjust_volume",
                value: volumePercentage
            });
    });
}

// Sends a message to content.js to request adjustment of volume.
function handleResetButton() {
    document.getElementById("confirmMessage").textContent = "Volume Resetted!";
    document.getElementById("volumeSlider").value = 100;
    document.getElementById("output").textContent = 100 + "%";
    chrome.storage.sync.set({ "volumePercentage": 100 });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                message: "adjust_volume",
                value: 100
            });
    });
}