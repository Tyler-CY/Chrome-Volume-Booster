// popup.html set-up
// initializeCurrentVolumePercentage();
initializeDom();
getTabVolumePercentageValue();


/*
Helper Functions
 */

/**
 * Initialize popup.html
 */
function initializeDom() {
// Initialize input action of the slide bar
    document.getElementById("volumeSlider").addEventListener("input", setSliderOutputValue);
// Set up the confirm button response
    document.getElementById("confirmButton").addEventListener("click", handleConfirmButton);
// Set up the reset button response
    document.getElementById("resetButton").addEventListener("click", handleResetButton);
}

/**
 * Show the slider value in the HTML page.
 */
function setSliderOutputValue() {
    // Update popup.html
    document.getElementById("output").textContent = document.getElementById("volumeSlider").value + "%";
    document.getElementById("confirmMessage").textContent = "";
}

/**
 * Sends a message to content.js to request adjustment of volume.
 */
function handleConfirmButton() {
    // Notify user
    document.getElementById("confirmMessage").textContent = "Settings Applied!";

    // Call content.js to save the new volume in storage.
    saveNewVolume();

    // Send a message to content.js to adjust the volume.
    applyNewVolume();
}


/**
 * Sends a message to content.js to request adjustment of volume.
 */
function handleResetButton() {
    resetVolume();
}

/**
 * Call content.js to apply the new volume (i.e. currentVolumePercentage) to the Gain Node.
 * Prerequisite: currentVolumePercentage is updated.
 */
function applyNewVolume() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                message: "adjust_volume",
            });
    });
}

/**
 * Call content.js to save the new volume (i.e. currentVolumePercentage).
 */
function saveNewVolume() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                message: "save_volume",
                value: document.getElementById("volumeSlider").value
            });
    });
}

/**
 * Call content.js to reset the volume to default value.
 */
function resetVolume() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        // Reset the DOM.
        document.getElementById("volumeSlider").value = DEFAULT_VOLUME_PERCENTAGE;
        document.getElementById("output").textContent = DEFAULT_VOLUME_PERCENTAGE + "%";

        // Send a message to content.js to reset volume.
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                message: "reset_volume",
            });
    });
}

/**
 * Call content.js to get the saved volume value
 */
function getTabVolumePercentageValue() {
    chrome.tabs.query({active: true, currentWindow: true},
        function (tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    message: "get_volume",
                },
                function (response) {
                    document.getElementById("volumeSlider").value = response;
                    document.getElementById("output").textContent = response + "%";
                }
            );
        },
    );
}