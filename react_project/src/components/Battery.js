import React, {useEffect, Component} from "react";
import styles from './modules/Battery.module.css'

export default class BatteryDetails extends Component {

    constructor(props) {
      super(props);

      this.state = {
        batteryLevel: this.props.data,
      };
    }

    getBatteryLevel = () => {
      if (this.props.data < 15) {
        return <div className={ styles.veryLow }> Battery: { this.props.data + "%"} </div>
      } else if (this.props.data > 15) {
        return <div className={ styles.low }> Battery: { this.props.data + "%"}  </div>
      } else if (this.props.data > 45) {
        return <div className={ styles.halfFull }> Battery: { this.props.data + "%"} </div>
      } else if (this.props.data > 75) {
        return <div className={ styles.high }> Battery: { this.props.data + "%"} </div>
      } else if (this.props.data > 90) {
        return <div className={ styles.full }> Battery: { this.props.data + "%"} </div>
      }
    };

    
  
    render() {
      return ( 
        <div>
          { this.getBatteryLevel() }
        </div>
        
      );
    }
  }