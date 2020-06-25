var responseMessage = "..."
function handleExtensionPopup() {
    var url = null;
    
    chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
    }, function(tabs) {
            var tab = tabs[0];
            url = tab.url;
            // Post Request to LS SERVER must be sent from here, as chrome.tabs.query is async 
            //      and url var with valid data is not guaranteed outside. 
            // Outside this function, url might still be null.
            sendPostRequestToLambdaServer(url)
    });
}
  

function sendPostRequestToLambdaServer(url){
    console.log(url)
    var xhr = new XMLHttpRequest();
    var requestBody = {"url":url};
    console.log(JSON.stringify(requestBody))
    xhr.open("POST", "REPLACE_THIS_WITH_YOUR_AWS_API_GW_URL", true); // Asynchronous Request
    xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {   
                    var responseData = JSON.parse(xhr.responseText); 
                    var status = xhr.status;
                    if(status==200){
                        console.log(responseData.message)
                        responseMessage = responseData.message
                    }
                    else if(status>=400 && status<500){
                        console.log(responseData.errorMessage)
                        responseMessage = responseData.errorMessage
                    }
                    else {
                        console.log("Server side error.")
                        responseMessage = responseData.body.errorMessage
                    }
                    document.getElementById('messageStatus').innerHTML = responseMessage
            }
    }
    xhr.send(JSON.stringify(requestBody));
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("Tab Loaded!")
    handleExtensionPopup();
    
});

