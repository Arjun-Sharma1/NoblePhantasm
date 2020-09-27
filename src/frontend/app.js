import React, { Component } from 'react';
import '../css/AppButton.css';
import '../css/AppText.css';
import '../css/AppTextBox.css';
import '../css/AppList.css';


class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      gameCode: '',
      message: '',
      localPlayer:''
    };

    this.goToNewGame = this.goToNewGame.bind(this);
    this.goToJoinGame = this.goToJoinGame.bind(this);
    this.setLocalUser = this.setLocalUser.bind(this);
  }

  goToNewGame() {
    this.props.history.push('/newGame');
  }

  goToJoinGame() {
    this.props.history.push('/joinGame');
  }

  setLocalUser(username) {
    this.setState({
      localPlayer: username
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Noble Phantasm</h1>
        </header>
        <div className='button_base'>
          <div className="button_base b03_skewed_slide_in">
            <div onClick={this.goToNewGame}>New Game</div>
            <div></div>
            <div onClick={this.goToNewGame}>New Game</div>
          </div>
        </div>
        <div className='button_base'>
          <div className="button_base b03_skewed_slide_in">
            <div onClick={this.goToJoinGame}>Join Game</div>
            <div></div>
            <div onClick={this.goToJoinGame}>Join Game</div>
          </div>
        </div>
        <p className="footer">
          Created by: <a href="https://github.com/Arjun-Sharma1" rel="noopener noreferrer" target="_blank">Arjun</a> and &nbsp;
          <a href="https://github.com/aarb1" rel="noopener noreferrer" target="_blank">Aayush</a>
        </p>
      </div>
    );
  }
}

export default app;
