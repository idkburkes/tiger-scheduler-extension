import React from 'react';
import { Button, Stack } from 'react-bootstrap';
import styles from '../css/About.css';


const MailToButton = ({ email, subject = '', body = '', text}) => {
    let params = subject || body ? '?' : '';
    if (subject) params += `subject=${encodeURIComponent(subject)}`;
    if (body) params += `${subject ? '&' : ''}body=${encodeURIComponent(body)}`;
  
    return <Button variant="dark" href={`mailto:${email}${params}`}> {text} </Button>;
  };

 class About extends React.Component{
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <>
            <Stack gap={4}>
                <div className={styles.about_section}>
                    Found a bug or have a suggestion? 
                    <MailToButton 
                    email="idkburkes@gmail.com" 
                    subject="(ENTER SUBJECT HERE) - Tiger Scheduler Chrome Extension" 
                    body="Isaiah, "
                    text="Email me!"/>
                </div>
               
                <div className={styles.about_section}>
                    Want to contribute to this project?
                    <Button variant="dark" href="https://github.com/idkburkes/tiger-scheduler-extension">GitHub repo</Button>  
                </div>

                <div className={styles.about_section}>
                    Want to add me to your network? 
                    <Button variant="dark" href="https://www.linkedin.com/in/isaiah-burkes/">LinkedIn</Button>            
                </div>
            </Stack>
            </>
        );
    }
}


export default About;