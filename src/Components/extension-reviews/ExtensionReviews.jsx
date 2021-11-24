import React from 'react';
import ReactStars from "react-rating-stars-component";
import SelectSearch, { fuzzySearch } from 'react-select-search';
import styles from '../../css/ExtensionReviews.css';
import { 
    FloatingLabel,
    Form,
    Button,
    Stack } from 'react-bootstrap';
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

//Production and development api post routes
//Production and development server urls
const devUrl = "http://localhost:5000";
const prodUrl = "https://tiger-scheduler-express.herokuapp.com";



class ExtensionReviews extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            name: '',
            overall: 0.0,
            difficulty: 0.0,
            comment: '',
            would_take_again: false
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

     // Handles toggling would-take-again check box
     handleToggleWouldTakeAgain = () => {
         this.setState({would_take_again: !this.state.would_take_again})
     }

     // Handle submitting a new instructor review to database
     handleSubmitReview = () => {
            let newReview = {
                name: this.state.name,
                overall: this.state.overall,
                difficulty: this.state.difficulty,
                comment: this.state.comment,
                would_take_again: this.state.would_take_again
            }
        fetch(devUrl + '/api/instructor/update/' + this.state.name, {
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
            console.log('Extension received POST reponse');
            console.log(JSON.stringify(json));

        }).catch(function(err) {
            console.log(err);
        })
     }


  
    render() {
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
            </Stack>
         
        );
    }

}



export default ExtensionReviews;