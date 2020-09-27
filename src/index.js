import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import app from './frontend/app';
import JoinGame from './frontend/joinGame.js';
import NewGameCreate from './frontend/newGame.js';
import JoinGameID from './frontend/joinGameID.js';

function App() {
  const [username, setUsername] = useState('');
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path='/' component={app}/>
          <Route exact path='/joinGame' render={props => <JoinGame username={username} setUsername={setUsername} {...props}/>} />
          <Route exact path='/joinGame/:number' render={props => <JoinGameID username={username} setUsername={setUsername} {...props}/>} />
          <Route exact path='/newGame' render={props => <NewGameCreate username={username} setUsername={setUsername} {...props}/>} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
