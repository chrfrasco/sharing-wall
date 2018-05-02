import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Page from "./components/Page";
import Header from "./components/Header";
import Home from "./views/Home";
import Thanks from "./views/Thanks";
import Quote from "./views/Quote";
import Quotes from "./views/Quotes";
import NotFound from "./views/NotFound";
import ServerError from "./views/ServerError";

class App extends React.Component {
  render() {
    return (
      <Page>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/quote/:quoteID" component={Quote} />
          <Route exact path="/quotes" component={Quotes} />
          <Route path="/404" component={NotFound} />
          <Route path="/error" component={ServerError} />
          <Route component={() => <Redirect to="/404" />} />
        </Switch>
      </Page>
    );
  }
}

export default App;
