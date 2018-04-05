import React, { Component } from "react";
import logo from "./logo.svg";
import api from "./api";
import "./App.css";

class App extends Component {
  state = { msg: null };

  componentDidMount() {
    api.getMessage().then(msg => this.setState({ msg }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.msg || "Loading..."}</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
