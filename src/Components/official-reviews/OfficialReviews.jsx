    /*global chrome*/
    import React, {useState, useEffect} from 'react';
    import Review from '../Review.jsx';
    import LoadingIcon from '../LoadingIcon.jsx';
    import { Stack } from 'react-bootstrap';
    import styles from '../../css/OfficialRatings.css';
    
    
    function OfficialReviews() {
    
      const [instructors, setInstructors] = useState([]);
      const [instructorReviews, setInstructorReviews] = useState([]);
    
    //Production and development server urls
    const devUrl = "http://localhost:5000";
    const prodUrl = "https://tiger-scheduler-express.herokuapp.com";
    
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
          console.log('background to react comp' + JSON.stringify(response));
          setInstructors(response);
      });
      if (instructors.length != 0) {
          fetchInstructorData(devUrl) // Fetch all professors on screen when component is mounted  

          //test get request to db
          instructors.map(instructor => getInstructorDataFromDB(instructor));
      }
  }, [instructors])


  const fetchInstructorData = (url) => {
      fetch(url + '/api/ratings', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              //The body of POST request is professor names parsed from Tiger Scheduler page 
              body: JSON.stringify({
                  "instructors": instructors
              })
          })
          .then((res) => res.json())
          .then((json) => {
              //Perform actions after receiving response
              console.log('Extension received POST reponse');
              console.log(JSON.stringify(json));
              setInstructorReviews(json);

          }).catch(function(err) {
              console.log(err);
          })
  }

    const getInstructorDataFromDB = (instructor) => {
        fetch(devUrl + '/instructor/' + instructor.name , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((json) => {
            //Perform actions after receiving response
            if(json === null) {
                console.log('No data retrieved from database')
                addInstructorToDB(instructor.name);
            } else {
                console.log('Extension received GET reponse from mongodb');
                console.log(JSON.stringify(json));
            }
        }).catch(function(err) {
            console.log(err);
        })
    }


    const addInstructorToDB = (name) => {
        fetch(devUrl + '/instructor/add' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //The body of POST request is instructor name parsed from Tiger Scheduler page 
            body: JSON.stringify({
                "name": name
            })
        })
        .then((res) => res.json())
        .then((json) => {
            //Perform actions after receiving response
            console.log('here is response after adding ' + name + " to db: " 
            + JSON.stringify(json));
        }).catch(function(err) {
            console.log(err);
        })
    }

              // Render
              if(instructorReviews.length > 0) {
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
    