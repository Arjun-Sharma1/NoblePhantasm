import { Switch, Route } from 'react-router-dom'
import React, { Component } from 'react';


export class game extends Component {
    
    constructor(props) {
        super(props);
        console.log(this.state.roles);
    }
    
    render() {
        return (
            <div>
            <p>Game time</p>
            </div>
        );
    }
}