
var responseMessage = "Sending Message..."

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
    xhr.open("POST", "https://oy50r7dup5.execute-api.us-east-1.amazonaws.com/dev/slackMarker", true); // Asynchronous Request
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
                        responseMessage = responseData.body.errorMessage;
                    }
            }
    }
    xhr.send(JSON.stringify(requestBody));
}


handleExtensionPopup();


chrome.runtime.sendMessage(responseMessage);