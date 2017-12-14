import React, { Component } from 'react';
import {rolesRegistry, localUser} from './joinGame';
var HashMap = require('hashmap');

var roles;

export class game extends Component {

    constructor(props) {
        super(props);
        this.state = {username: '', userRole: ''};
        this.state.username = localUser;
        roles = new HashMap(rolesRegistry);
        this.state.userRole = roles.get(localUser);
    }

    render() {
        return (
          <div ref="roles" className="App">
            <div>
                <h1>{this.state.username}</h1>
                <h3>You have been assigned {this.state.userRole}!</h3>
            </div>
          </div>
        );
    }
}
