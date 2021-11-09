import React from 'react';
import ReactStars from "react-rating-stars-component";
import SelectSearch, { fuzzySearch } from 'react-select-search';
import styles from '../../css/ExtensionReviews.css';
import { FloatingLabel, Form, Button, Container } from 'react-bootstrap';
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
    value: 1,
    isHalf: true,
    onChange: newValue => {
      console.log(`Star rating set to ${newValue}`);
    }
  };

  // JSON file containing all Auburn professor names
  const searchOptions = require('../../data/au-faculty-names.json'); 


class ExtensionReviews extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        }
    }

    // Handle changes to search value while typing
     handleChangeSearchVal = (newVal) => {
         this.setState({searchValue: newVal});
         console.log('set state to' + newVal);
     }
  
    render() {
        return (
            <Container> 
            <div>

        <SelectSearch
                options={searchOptions.Instructors}
                value={this.state.searchValue}
                onChange={newVal => this.handleChangeSearchVal(newVal)}
                search
                emptyMessage="Not found"
                placeholder="Choose a Professor"
                filterOptions={fuzzySearch}        
            />
                <h4> Overall Quality </h4>
                <ReactStars {...starOptions} />

                <h4> Difficulty </h4>
                <ReactStars {...starOptions} />

                <h4> Leave a comment </h4>
                <FloatingLabel controlId="floatingTextarea" label="Comments">
                    <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here about this professor here."
                        style={{ height: '100px' }}
                    />
                </FloatingLabel>

                <Form.Check type="checkbox" label="Would take again?" />
            </div>

            <div className={styles.submit_btn}>  <Button type="submit">Submit</Button>   </div>
            </Container>
         
        );
    }

}


export default ExtensionReviews;