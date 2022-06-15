// CONSTANTS
const DEFAULT_VOLUME_PERCENTAGE = 100;
// (Global) Variables
let tabKey;
var currentVolumePercentage;


// popup.html set-up
initializeCurrentVolumePercentage();
initializeDom();


/*
Helper Functions
 */

// Initialize the Current Volume Percentage according to local storage, or set to default value
function initializeCurrentVolumePercentage() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

        let tabId = tabs[0].id;
        tabKey = "volumePercentage" + tabId;

        currentVolumePercentage = localStorage.getItem(tabKey);
        // if null, then set as default value and store in localstorage
        if (currentVolumePercentage == null) {
            currentVolumePercentage = DEFAULT_VOLUME_PERCENTAGE;
            localStorage.setItem(tabKey, String(currentVolumePercentage));
        }
        // Do casting here after checking for null. (It's not a good idea to do Number(null)).
        currentVolumePercentage = Number(currentVolumePercentage);

        // Set the default value of the volume slider
        document.getElementById("volumeSlider").value = currentVolumePercentage;
        // Set the default value of the volume slider output text
        document.getElementById("output").textContent = currentVolumePercentage + "%";
    });
}

// Initialize popup.html
function initializeDom() {
// Initialize input action of the slide bar
    document.getElementById("volumeSlider").addEventListener("input", setSliderOutputValue);
// Set up the confirm button response
    document.getElementById("confirmButton").addEventListener("click", handleConfirmButton);
// Set up the reset button response
    document.getElementById("resetButton").addEventListener("click", handleResetButton);
}

// Show the slider value in the HTML page.
function setSliderOutputValue() {
    // Update the variables
    currentVolumePercentage = document.getElementById("volumeSlider").value;
    // Update popup.html
    document.getElementById("output").textContent = currentVolumePercentage + "%";
    document.getElementById("confirmMessage").textContent = "";
}

// Sends a message to content.js to request adjustment of volume.
function handleConfirmButton() {
    // Notify user
    document.getElementById("confirmMessage").textContent = "Settings Applied!";

    // Update the volume percentage of the current tab.
    localStorage.setItem(tabKey, String(currentVolumePercentage));

    // Send a message to content.js to adjust the volume accordingly.
    ApplyNewVolume();
}



// Sends a message to content.js to request adjustment of volume.
function handleResetButton() {

    // Notify User
    document.getElementById("confirmMessage").textContent = "Volume Resetted!";
    document.getElementById("volumeSlider").value = DEFAULT_VOLUME_PERCENTAGE;
    document.getElementById("output").textContent = DEFAULT_VOLUME_PERCENTAGE + "%";

    // Reset tab volume percentage to default.
    currentVolumePercentage = DEFAULT_VOLUME_PERCENTAGE;
    // Update the volume percentage of the current tab.
    localStorage.setItem(tabKey, String(currentVolumePercentage));

    // Send a message to content.js to adjust the volume accordingly.
    ApplyNewVolume();
}

// Call content.js to apply the new volume (i.e. currentVolumePercentage) to the Gain Node.
// Prerequisite: currentVolumePercentage is updated.
function ApplyNewVolume() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                message: "adjust_volume",
                value: currentVolumePercentage
            });
    });
}