// Variable for volume percentage
let volumePercentage = 100;

// Initialize input action of the slide bar
document.getElementById("volumeSlider").addEventListener("input", setSliderOutputValue);
// Set up the confirm button response
document.getElementById("confirmButton").addEventListener("click", handleConfirmButton);


// Show the slider value in the HTML page
function setSliderOutputValue() {
    volumePercentage = document.getElementById("volumeSlider").value;
    document.getElementById("output").textContent = volumePercentage + "%";
    document.getElementById("confirmMessage").textContent = "";
}

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