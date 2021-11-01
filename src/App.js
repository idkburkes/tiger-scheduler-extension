import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import OfficialRatings from './Components/OfficialRatings';
import ExtensionRatings from './Components/ExtensionRatings';
import About from './Components/About';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Tabs, Tab, Row, Col } from 'react-bootstrap';


function App() {

  
  return (
   
    <Container className="App-wrapper App">
                <Row>
                     <Col>
                         <Tabs defaultActiveKey="officialRatings" 
                               id="page-selection" className="tabs">
                             <Tab eventKey="officialRatings" title="Reviews">
                                 <OfficialRatings />
                             </Tab>
                             <Tab eventKey="extensionRatings" title="Leave a review">
                                 <ExtensionRatings />
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
