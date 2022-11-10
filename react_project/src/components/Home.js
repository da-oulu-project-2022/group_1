import React from 'react';
// import axios from 'axios';
import Constants from '../Constants.json'
import styles from './modules/Home.module.css';
import polarLogo from './images/polar-logo.png';

class Home extends React.Component {
    constructor(props) {
        super(props)      
        this.state = {
            clicked: "",
        };
    }

// When the component mounts, check that the browser supports Bluetooth
useEffect = () => {
    if (navigator.bluetooth) {
        this.setState( { supportsBluetooth: true })
    }
}
// Let the user know when their device has been disconnected.
onDisconnected = (event) => {
    alert(`The device ${event.target} is disconnected`)
    this.setState( { isDisconnected: true })
}

    render() {
        return (
            <>
            <div>
                Bluetooth connection status: { this.state.clicked }
            </div>
            <div>
                <div className = { styles.buttonContainer }>
                    <button onClick={ () => this.setState({ clicked: "Your device is now connected" })}> Click Here</button>
                </div>
            </div>       
            </>
        );
    }

}

export default Home;
