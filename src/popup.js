// Variable for volume percentage
let volumePercentage = 100;

// Initialize input action of the slide bar
let slider = document.getElementById("volumeSlider");
if (slider) {
    slider.addEventListener("input", setSliderOutputValue);
}

// Set up the confirm button response
let confirmButton = document.getElementById("confirmButton");

if (confirmButton) {
    confirmButton.addEventListener("click", handleConfirmButton);
}



// Show the slider value in the HTML page
function setSliderOutputValue() {
    volumePercentage = document.getElementById("volumeSlider").value + "%";
    console.log(volumePercentage);
    document.getElementById("output").textContent = volumePercentage;
}

function handleConfirmButton() {
    console.log("volumePercentage is: " + volumePercentage);


    const mediaStream = document.querySelector("video");
    if (!mediaStream) return undefined;

    const audioContext = new AudioContext();
    const mediaElementAudioSourceNode = audioContext.createMediaElementSource(mediaStream);
    const gainNode = audioContext.createGain();

    gainNode.gain.value = 0.5;
    mediaElementAudioSourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

}