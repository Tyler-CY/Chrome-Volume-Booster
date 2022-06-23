chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab){
        if (changeInfo.url){
            // Reset the gain node
            chrome.tabs.sendMessage(
                tabId,
                {
                    message: "reset_volume",
                }
            );
        }
        else{
            // Apply previous settings
            chrome.tabs.sendMessage(
                tabId,
                {
                    message: "restore_volume",
                }
            );
        }
    }
);