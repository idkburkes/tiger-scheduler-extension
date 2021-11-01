// Keep track of content-script messages that were sent while extension popup was closed
const messageQueue = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === 'CONTENT_SCRIPT_UPDATE') {
    console.log('Received update from content script.');
        messageQueue.push(message.data);
  } else if (message.type === 'REACT_COMPONENT_UPDATE') {

    // Send most recent update from content-script and empty queue
    resp = messageQueue.pop();
    sendResponse(resp);
    while(messageQueue.length > 0) {messageQueue.pop()};
  }
});
