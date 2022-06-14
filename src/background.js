// Default value of volume percentage
let volumePercentage = 500;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ volumePercentage });
    console.log('Default volume percentage set to %d%', volumePercentage);
})