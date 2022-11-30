import React from "react";
import { Component } from "react";
import styles from './modules/Battery.module.css'

export default class BatteryDetails extends Component {

    constructor(props) {
      super(props);
  
      this.state = {
        currentBatteryLevel: 0
      };
  
      window.addEventListener("batterystatus", (status) => this.onBatteryStatus(status), false);
      window.dispatchEvent(new Event('batterystatus'));
    }
  
    onBatteryStatus(status) {
      this.setState({ currentBatteryLevel: status.level });
    }
  
    render() {
      return ( 
        <div>
          Remaining: { this.state.currentBatteryLevel } 
        </div>
      );
    }
  }