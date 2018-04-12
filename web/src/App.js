import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Page from "./components/Page";
import Home from "./views/Home";
import Thanks from "./views/Thanks";

class App extends Component {
  render() {
    return (
      <Page>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/thanks" component={Thanks} />
        </Switch>
      </Page>
    );
  }
}

export default App;
