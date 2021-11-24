    /*global chrome*/
    import React, {useState, useEffect} from 'react';
    import Review from '../Review.jsx';
    import LoadingIcon from '../LoadingIcon.jsx';
    import { Stack } from 'react-bootstrap';
    import styles from '../../css/OfficialRatings.css';
    
    // Set server-url for production and development
    const SERVER_URL = process.env.REACT_APP_ENV === 'DEV' 
        ? process.env.REACT_APP_DEV_SERVER_URL : process.env.REACT_APP_PROD_SERVER_URL;

    function OfficialReviews() {
    
      const [instructors, setInstructors] = useState([]);
      const [currentUniqueNames, setCurrentUniqueNames] = useState([]);
      const [instructorReviews, setInstructorReviews] = useState([]);
    
    
    // JSON file containing all Auburn professor names
    const faculty = require('../../data/au-faculty-names.json'); 

    useEffect(() => {
      // Send message to background script to request instructors currently on the screen
      chrome.runtime.sendMessage({
          type: 'REACT_COMPONENT_UPDATE'
      }, (response) => {
          if (chrome.runtime.lastError || !response) {
              console.log('Error requesting instructors from Tiger Scheduler.')
              return;
          }
          console.log('Chrome background script found these instructor names:' + JSON.stringify(response));
          setInstructors(response);
      });
      if (instructors.length != 0) {
          setInstructorReviews([]); 
          var uniqueNames = getUniqueNamesFromClient(instructors);

          // Retrieve each instructor's data from database
          uniqueNames.map(name => getInstructorDataFromDB(name));
      }
  }, [instructors])



    const getInstructorDataFromDB = (name) => {
        fetch(SERVER_URL + '/api/instructor/' + name , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((json) => {
            //Perform actions after receiving response
            if(json === null) {
                console.log(name + ' not found in database. Ratings will be' +
                ' displayed after server finishes scraping data.')
                addInstructorToDB(name);
            } else {
                console.log('Data retrieved from database: ' + JSON.stringify(json));
                setInstructorReviews(instructorReviews => [...instructorReviews, json])
            }
        }).catch(function(err) {
            console.log(err);
        })
    }


    const addInstructorToDB = (name) => {
        fetch(SERVER_URL + '/api/instructor/add' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": name
            })
        })
        .then((res) => res.json())
        .then((json) => {
            // Handle Sucess
            if(json.acknowledged === true) { 
                console.log(name + ' sucessfully added to database');
                getInstructorDataFromDB(name);
            }
        }).catch(function(err) {
            // Handle error
            console.log(err);
        })
    }


    const getUniqueNamesFromClient = (instructorData) => {
        var uniqueNames = [];

        for(let i = 0; i < instructorData.length; i++) {
            let splitNames = instructorData[i].name.split(';');
            for(let j = 0; j < splitNames.length; j++) {
                if(uniqueNames.filter(name => splitNames[j].trim() === name.trim()).length == 0) {
                    uniqueNames.push(splitNames[j].trim());
                }
            }
        }
        setCurrentUniqueNames(uniqueNames);
        return uniqueNames;
    }

              // Render
              if(instructorReviews.length > 0 && currentUniqueNames.length == instructorReviews.length) {
                return (
                      <div className="reviews">
                        <Stack gap={2} className="col-md-5 mx-auto">
                            {instructorReviews.map((instructor) =>
                                <Review name={instructor.name}
                                    rating={instructor.rating}
                                    wouldTakeAgain={instructor.wouldTakeAgain}
                                    difficulty={instructor.difficulty}              
                                    link={instructor.link}/>
                            )}
                        </Stack>
                      </div>
                          )
              } else {
                return ( <div className="loading"> <LoadingIcon/> </div>  )
              }
    }
    
    export default OfficialReviews;
    