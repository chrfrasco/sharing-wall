import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Page from "./components/Page";
import Home from "./views/Home";

class App extends Component {
  render() {
    return (
      <Page>
        <Header />

        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Page>
    );
  }
}

export default App;
