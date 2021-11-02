import React from 'react';
import { Spinner, Button} from 'react-bootstrap';
import styles from '../css/LoadingIcon.css';

// Icon to display while extension is loading instructor data

 class LoadingIcon extends React.Component{
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <div>
               {
                <Button variant="custom" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Searching for professors...
              </Button>}
            </div>
        );
    }

}


export default LoadingIcon;