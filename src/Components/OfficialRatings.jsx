    /*global chrome*/
    import React, {useState, useEffect} from 'react';
    import  Review from './Review.jsx';
    import { Container, Stack, Spinner, Button} from 'react-bootstrap';
    import styles from '../css/OfficialRatings.css';
    
    function OfficialRatings() {
    
      const [instructors, setInstructors] = useState([]);
      const [instructorReviews, setInstructorReviews] = useState([]);
    
      // These routes will have to be set after server is deployed (not localhost)
    const devRoute = "http://localhost:3000/api/ratings";
    const prodRoute = "https://tiger-scheduler-express.herokuapp.com/api/ratings";
    
                    useEffect( () => {
                        // Send message to background script to request instructors currently on the screen
                        chrome.runtime.sendMessage({type: 'REACT_COMPONENT_UPDATE'}, (response) => {
                            if(chrome.runtime.lastError || !response) {
                                console.log('Error requesting instructors from Tiger Scheduler.')
                                return;
                            }
                            console.log('background to react comp' + JSON.stringify(response));
                              setInstructors(response);
                        });
                        if(instructors.length != 0) {
                          fetchInstructorData(devRoute) // Fetch all professors on screen when component is mounted  
                        }
                      }, [instructors])   
                      
    
                              const fetchInstructorData = (route) => {
                                fetch(route, {
                                  method: 'POST',
                                  headers: {'Content-Type': 'application/json' },
                                  //The body of POST will be the professor names parsed from Tiger Scheduler page 
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
    
                      <div className={styles.ratings}>
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
                return ( <div> {
                <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Searching for professors...
              </Button>}
               </div>  )
              }
                    
                
    
    }
    
    export default OfficialRatings;
    