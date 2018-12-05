import React, { Component } from "react";
import logo from "./logo.svg";
import "./index.css";
import "./App.css";

class App extends Component {
  state = {
    clicked: false,
    showDiv: false
  };

  handleClick = () => {
    setTimeout(() => {
      this.setState({ showDiv: true });
    }, 2000);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <button onClick={this.handleClick}>click me</button>

          {this.state.showDiv && <span>HIIIII</span>}
        </header>
      </div>
    );
  }
}

export default App;
