const DEFAULT_VOLUME_PERCENTAGE = 100;

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab){

        // Change popup.html
        chrome.runtime.sendMessage({message: "reset"});

        // Reset the gain node
        if (changeInfo.url){
            chrome.tabs.sendMessage(
                tabId,
                {
                    message: "adjust_volume",
                    value: DEFAULT_VOLUME_PERCENTAGE
                }
            );
        }
    }
);