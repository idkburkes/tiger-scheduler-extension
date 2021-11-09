import './App.css';
import React, {useState, useEffect} from 'react';
import OfficialReviews from './Components/official-reviews/OfficialReviews';
import ExtensionReviews from './Components/extension-reviews/ExtensionReviews';
import About from './Components/About';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Tabs, Tab, Row, Col } from 'react-bootstrap';


function App() {

  
  return (
   
    <Container className="App-wrapper">
                <Row>
                     <Col>
                         <Tabs defaultActiveKey="officialReviews" 
                               id="page-selection" className="tabs">
                             <Tab eventKey="officialReviews" title="Reviews">
                                 <OfficialReviews />
                             </Tab>
                             <Tab eventKey="extensionReviews" title="Leave a review">
                                 <ExtensionReviews />
                             </Tab>
                             <Tab eventKey="about" title="About">
                                 <About />
                             </Tab>
                         </Tabs>
                     </Col>
                 </Row>
    </Container>
   
  );
}

export default App;
