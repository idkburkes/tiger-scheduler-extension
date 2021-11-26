/*global chrome*/
import React from 'react';
import ReactStars from "react-rating-stars-component";
import SelectSearch, { fuzzySearch } from 'react-select-search';
import styles from '../../css/ExtensionReviews.css';
import { 
    FloatingLabel,
    Form,
    Button,
    Stack,
    Alert } from 'react-bootstrap';
// --- This component will allow users to leave professor reviews in our
// --- extension. Completely independent from RateMyProfessor. 
// --- These reviews will be persisted in a NoSQL database (mongoDB)
// --- Reviews will require approval before they are displayed on the extension.


// Options for rating-star-component
const starOptions = {
    size: 30,
    count: 5,
    color: "black",
    activeColor: "orange",
    value: 0,
    isHalf: true
  };


  // JSON file containing all Auburn professor names
  const searchOptions = require('../../data/au-faculty-names.json'); 

// Set server-url for production and development
const SERVER_URL = process.env.REACT_APP_ENV === 'DEV' 
? process.env.REACT_APP_DEV_SERVER_URL : process.env.REACT_APP_PROD_SERVER_URL;



class ExtensionReviews extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            name: '',
            overall: 0.0,
            difficulty: 0.0,
            comment: '',
            would_take_again: false,
            showPopup: false,
            username: ''
        }
    }

    componentDidMount() {
        if(this.state.username === '') {
            // Send message to background script to request username
          chrome.runtime.sendMessage({
            type: 'GET_USERNAME'
            }, (response) => {
                if (chrome.runtime.lastError || !response) {
                    console.log('Error getting username from Tiger Scheduler.')
                    return;
                }
            
            // Set the name of user logged into Tiger Scheduler
            this.handleSetUsername(response);
                });
            } 
    }


    // Handle changes to search value while typing instructor names
     handleChangeSearchVal = (i) => {
        this.setState({searchValue: i});
        this.setState({name: searchOptions.Instructors[i].name});
     }

     // Handles changes to the text-box for comments
     handleChangeComment = (e) => {
         this.setState({comment: e.target.value})
     }

    // Handle changes to the Overall Quality star-rating component
     handleChangeOverall = (newOverall) => {
         this.setState({overall: newOverall});
     }

    // Handle changes to the Difficulty star-rating component
     handleChangeDifficulty = (newDifficulty) => {
        this.setState({difficulty: newDifficulty});
     }

    // Handle setting user logged into Tiger Scheduler
     handleSetUsername = (username) => {
         this.setState({username: username});
     }


     // Handles toggling would-take-again check box
     handleToggleWouldTakeAgain = () => {
         this.setState({would_take_again: !this.state.would_take_again})
     }

     handleResetState = () => {
        this.setState({
            searchValue: '',
            name: '',
            overall: 0.0,
            difficulty: 0.0,
            comment: '',
            would_take_again: false,
            showPopup: false
        })
     }

     // Handle submitting a new instructor review to database
     handleSubmitReview = () => {

        var newReview = {
            name: this.state.name,
            overall: this.state.overall,
            difficulty: this.state.difficulty,
            comment: this.state.comment,
            would_take_again: this.state.would_take_again,
            username: this.state.username
        } 
  
        fetch(SERVER_URL + '/api/instructor/update/' + this.state.name, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "review": newReview
            })
        })
        .then((res) => res.json())
        .then((json) => {
            //Perform actions after receiving response
            console.log(JSON.stringify(json));

        }).catch(function(err) {
            console.log(err);
        })

        // Show submission popup
        this.setState({ showPopup: true })
     }


  
    render() {
        if(!this.state.showPopup) {
            return (
                <Stack gap={2}> 
                <div className="review_content">

            <SelectSearch
                    options={searchOptions.Instructors}
                    value={this.state.searchValue}
                    onChange={name => this.handleChangeSearchVal(name)}
                    search
                    emptyMessage="Not found"
                    placeholder="Choose a Professor"
                    filterOptions={fuzzySearch}        
                />
                    <Form.Group> 
                        <Form.Label> Overall Quality </Form.Label>
                        <ReactStars
                            onChange={e => this.handleChangeOverall(e)} 
                            {...starOptions} />
                    </Form.Group>
                    <Form.Group> 
                        <Form.Label> Difficulty </Form.Label>
                        <ReactStars
                            onChange={e => this.handleChangeDifficulty(e)}
                            {...starOptions} />
                    </Form.Group>
    
                    <Form.Group> 
                        <Form.Label> Leave a comment </Form.Label>
                            <FloatingLabel controlId="floatingTextarea" label="Comments">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter detailed feedback"
                                    style={{ height: '100px', width: '100%' }}
                                    onChange={newComment => this.handleChangeComment(newComment)}
                                />
                        </FloatingLabel>
                    </Form.Group>
    
                    <Form.Check 
                    type="checkbox"
                    label="Would take again?"
                    onChange={this.handleToggleWouldTakeAgain} />
                
    
                    <div className={styles.submit_btn}> 
                        <Button 
                        type="submit"
                        onClick={this.handleSubmitReview}
                        >Submit</Button> 
                    </div>
                </div>
                </Stack>)
        } else {
            return (<Alert show={this.state.showPopup} variant="success">
            <p>
                Your review for <b>{this.state.name}</b> has been submitted.
                Thank you!
            </p>
            <hr/>
            <div className="d-flex justify-content-end">
                <Button onClick={this.handleResetState} variant="outline-success">
                    Submit another review
                </Button>
            </div>
        </Alert>)
        }
    }

}






export default ExtensionReviews;