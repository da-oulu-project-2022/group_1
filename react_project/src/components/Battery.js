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
        return <div><img className={ styles.veryLow }></img><p className={ styles.text }>Battery: { this.props.data + "%"} </p></div>
      } else if (this.props.data > 15) {
        return <div><img className={ styles.low }></img><p className={ styles.text }>Battery: { this.props.data + "%"}  </p></div>
      } else if (this.props.data > 45) {
        return <div><img className={ styles.halfFull }></img><p className={ styles.text }>Battery: { this.props.data + "%"} </p></div>
      } else if (this.props.data > 75) {
        return <div><img className={ styles.high }></img><p className={ styles.text }>Battery: { this.props.data + "%"} </p></div>
      } else if (this.props.data > 90) {
        return <div><img className={ styles.full }></img><p className={ styles.text }>Battery: { this.props.data + "%"} </p></div>
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