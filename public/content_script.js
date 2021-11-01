

function getDataFromDOM(nameSelector, collegeSelector) {
      var names = document.querySelectorAll(nameSelector);
      var courseInfo = document.querySelectorAll(collegeSelector);

  if (names && courseInfo) {
    // Create and populate array of instructor objects
    var instructors = [];

    for(i = 0; i < names.length; i++) {
      var instructor = {
        name: '',
        courseInfo: ''
      }

      // Skip courses found with no instructor name
      if(names[i].innerText.length > 0) {
        console.log('founder instructor name' + names[i].innerText);
        instructor.name = names[i].innerText;
        instructor.courseInfo = courseInfo[i].innerText;
        instructors.push(instructor);  
      }
     
    }

    console.log('Client script sending data' + JSON.stringify(instructors));
    return instructors;
  } else {
    console.log('No DOM elements found with instructor names')
  }
  return undefined;
}


      // Notify the background script that there has been an update on Tiger Scheduler page
      function notifyBackgroundPage() {
        chrome.runtime.sendMessage({
            type: 'CONTENT_SCRIPT_UPDATE', 
            data: getDataFromDOM('[title="Instructor(s)"]', '.leftnclear.attrInfo')
        });
  }


    // Adds event listener after DOM is loaded for the first time 
    // Content script notifies background.js of any updates on every click
window.onload = () => {
  window.addEventListener('load', notifyBackgroundPage);
  window.addEventListener("click", notifyBackgroundPage);
  notifyBackgroundPage();
}



