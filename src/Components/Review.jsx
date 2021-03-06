import React from 'react';
import {Container, Accordion } from 'react-bootstrap';
import styles from '../css/Review.css'

 class Review extends React.Component {

  // Render each review as an Accordion dropdown
    render() {
      return( 
      
      <div className={styles.review}> 
        <Container>
        <Accordion>
        <Accordion.Item>
           <Accordion.Header 
           eventKey={this.props.name} className={styles.panelHeader} bsPrefix="panelHeader" >
               <a href={this.props.link}>{this.props.name}</a>
           </Accordion.Header>
           <Accordion.Body
            eventKey={this.props.name} className={styles.panelBody} bsPrefix="panelBody" >
                <div className={styles.panelText}> 
                Overall Quality: {this.props.rating}/5    
                </div> 
                <div className={styles.panelText}> 
                {this.props.wouldTakeAgain}% would take again
                </div>
                <div className={styles.panelText}> 
                Level of Difficulty: {this.props.difficulty}/5
                </div>   
          </Accordion.Body>
       </Accordion.Item>
       </Accordion>
       </Container>
       </div>)
    }
  }

  export default Review;