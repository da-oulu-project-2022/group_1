import React from "react";
import { Component } from "react";
import styles from './modules/Battery.module.css'

export default class BatteryDetails extends Component {

    constructor(props) {
      super(props);

      this.state = {
        batteryLevel: getBatteryLevel(),
      };
    }  

    getBatteryLevel = () => {
      if (this.props.data) {
        this.setState({batteryLevel: this.props.data});
      }
    }
    
  
    render() {
      return ( 
        <div>
          Remaining: { this.props.data } 
        </div>
        
      );
    }
  }