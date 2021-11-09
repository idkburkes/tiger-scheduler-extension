    /*global chrome*/
    import React, {useState, useEffect} from 'react';
    import Review from '../Review.jsx';
    import LoadingIcon from '../LoadingIcon.jsx';
    import { Stack } from 'react-bootstrap';
    import styles from '../../css/OfficialRatings.css';
    
    
    function OfficialReviews() {
    
      const [instructors, setInstructors] = useState([]);
      const [instructorReviews, setInstructorReviews] = useState([]);
    
    //Production and development api post routes
    const devRoute = "http://localhost:5000/api/ratings";
    const prodRoute = "https://tiger-scheduler-express.herokuapp.com/api/ratings";
    
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
          fetchInstructorData(devRoute) // Fetch all professors on screen when component is mounted  
      }
  }, [instructors])


  const fetchInstructorData = (route) => {
      fetch(route, {
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
    