import React, { Component } from "react";
import logo from "./logo.svg";
import api from "./api";
import "./App.css";

class Quotes extends Component {
  state = { quotes: null };

  componentDidMount() {
    api.getQuotes().then(quotes => this.setState({ quotes }));
  }

  render() {
    return this.state.quotes == null ? "Loading..." : this.renderQuotes();
  }

  renderQuotes() {
    const lis = this.state.quotes.map(quote => (
      <li>{JSON.stringify(quote)}</li>
    ));
    return <ul>{lis}</ul>;
  }
}

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

        <Quotes />
      </div>
    );
  }
}

export default App;
