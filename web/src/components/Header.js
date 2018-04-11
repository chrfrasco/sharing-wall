import React from "react";
import api from "../api";

const LOADING = Symbol("LOADING");
const LOADED = Symbol("LOADED");
const ERROR = Symbol("ERROR");

export default class Header extends React.Component {
  state = { fetchState: LOADING };

  componentDidMount() {
    api
      .getMessage()
      .then(msg => this.setState({ fetchState: LOADED, msg }))
      .catch(() => this.setState({ fetchState: ERROR }));
  }

  render() {
    let msg;
    switch (this.state.fetchState) {
      case LOADING:
        msg = "Loading...";
        break;
      case LOADED:
        msg = this.state.msg;
        break;
      case ERROR:
        msg = "Something went wrong";
        break;
      default:
        throw new TypeError(`could not handle state ${this.state.fetchState}`);
    }
    return (
      <header className="App-header">
        <h1>{msg}</h1>
      </header>
    );
  }
}
