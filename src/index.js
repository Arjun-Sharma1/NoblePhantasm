import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import app from './frontend/app';
import {joinGame} from './frontend/joinGame.js';
import {newGameCreate} from './frontend/newGame.js';
import {joinGameID} from './frontend/joinGameID.js';

ReactDOM.render((
  <BrowserRouter>
    <div>
      <Switch>
        <Route exact path='/' component={app}/>
        <Route exact path='/joinGame' component={joinGame}/>
        <Route exact path='/joinGame/:number' component={joinGameID}/>
        <Route exact path='/newGame' component={newGameCreate}/>
        <Route path='/joinGame/:number' component={joinGameID}/>
      </Switch>
    </div>
  </BrowserRouter>
), document.getElementById('root'))
