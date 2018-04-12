import React from "react";
import api, { states } from "../api";

export default class Header extends React.Component {
  state = { fetchState: states.LOADING };

  componentDidMount() {
    api
      .getMessage()
      .then(msg => this.setState({ fetchState: states.LOADED, msg }))
      .catch(() => this.setState({ fetchState: states.ERROR }));
  }

  render() {
    let msg;
    switch (this.state.fetchState) {
      case states.LOADING:
        msg = "Loading...";
        break;
      case states.LOADED:
        msg = this.state.msg;
        break;
      case states.ERROR:
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
