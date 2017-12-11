import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import App from './App';
import {joinGame, joinGameID} from './joinGame.js';
import {newGameCreate} from './newGame.js';

ReactDOM.render((
  <BrowserRouter>
    <div>
      <Switch>
        <Route exact path='/' component={App}/>
        <Route exact path='/joinGame' component={joinGame}/>
        <Route exact path='/joinGame/:number' component={joinGameID}/>
        <Route exact path='/newGame' component={newGameCreate}/>
      </Switch>
    </div>
  </BrowserRouter>
), document.getElementById('root'))
