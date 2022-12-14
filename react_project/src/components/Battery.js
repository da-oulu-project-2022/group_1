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
        return <div><img className={ styles.veryLow }></img></div>
      } else if (this.props.data < 45) {
        return <div><img className={ styles.low }></img></div>
      } else if (this.props.data < 75) {
        return <div><img className={ styles.halfFull }></img></div>
      } else if (this.props.data < 90) {
        return <div><img className={ styles.high }></img></div>
      } else if (this.props.data > 90) {
        return <div><img className={ styles.full }></img></div>
      }
    };

    
  getBatteryText = () => {
    if(this.props.theme == 'light'){
      return <p className={ styles.text }>Battery: { this.props.data + "%"} </p>
    }
    else {
      return <p className={ styles.textDark }>Battery: { this.props.data + "%"} </p>
    }
  }
  
  render() {
    
    return ( 
      <div>
        { this.getBatteryLevel() }
        { this.getBatteryText() }
      </div>
    )
  }
}
  