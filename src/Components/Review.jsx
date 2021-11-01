import React, {useState, useEffect} from 'react';
import {Card, Container, Accordion } from 'react-bootstrap';
import styles from '../css/Review.css'

 class Review extends React.Component {

// Change cards to an accordion 
    render() {
      return( 
      
      <div className={styles.review}> 
        <Container>
        <Accordion>
        <Accordion.Item>
           <Accordion.Header 
           eventKey={this.props.name} className={styles.panelHeader} bsPrefix="panelHeader" >
               {this.props.name} 
           </Accordion.Header>
           <Accordion.Body
            eventKey={this.props.name} className={styles.panelBody} bsPrefix="panelBody" >
                <div className={styles.panelText}> 
                Overall Quality: {this.props.rating}    
                </div> 
                <div className={styles.panelText}> 
                {this.props.wouldTakeAgain} would take again
                </div>
                <div className={styles.panelText}> 
                Level of Difficulty: {this.props.difficulty}
                </div>
                <div className={styles.panelText}> 
                See on <a href={this.props.link}>ratemyprofessor.com</a>
                </div>     
          </Accordion.Body>
       </Accordion.Item>
       </Accordion>
       </Container>
       </div>)
    }
  }

  export default Review;