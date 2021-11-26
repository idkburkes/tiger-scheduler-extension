// Keep track of content-script messages that were sent while extension popup was closed
const messageQueue = [];
var username = '';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === 'CONTENT_SCRIPT_UPDATE') {
    console.log('Received update from content script.');
        messageQueue.push(message.data);
  } else if (message.type === 'REACT_COMPONENT_UPDATE') {

    // Send most recent update from content-script and empty queue
    resp = messageQueue.pop();
    sendResponse(resp);
    while(messageQueue.length > 0) {messageQueue.pop()};
  } else if (message.type === 'USERNAME_UPDATE') {
    // Send the name of user logged into Tiger Scheduler
    console.log('Detected tiger-scheduler username is: ' + JSON.stringify(message.data));
    username = message.data;
  } else if(message.type == 'GET_USERNAME' && username !== '') {
      sendResponse(username);
  }
});
