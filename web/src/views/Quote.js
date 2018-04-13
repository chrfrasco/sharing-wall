import React from "react";
import { retrieveQuote } from "../utils";
import { states } from "../api";

export default class Quote extends React.Component {
  state = { loadingState: states.LOADING };

  componentDidMount() {
    if (this.state.fetch == null) {
      this.doFetch();
    }
  }

  render() {
    switch (this.state.loadingState) {
      case states.LOADING:
        return <h1>Loading...</h1>;
      case states.LOADED:
        return (
          <article>
            <h1>Quote by {this.state.quote.name}</h1>
            <p>They said "{this.state.quote.body}"</p>
            <img
              style={{ width: "100%" }}
              src={this.state.quote.img}
              alt={`Quote by ${this.state.quote.name}`}
            />
          </article>
        );
      case states.NOT_FOUND:
        return <h1>Could not find quote</h1>;
      case states.ERROR:
        return <h1>Oops, something went wrong.</h1>;
      default:
        throw new Error(`loadingState ${this.state.loadingState} not valid`);
    }
  }

  async doFetch() {
    const { match: { params } } = this.props;
    try {
      const quote = await retrieveQuote(params.quoteID);
      this.setState({ quote, loadingState: states.LOADED });
    } catch (e) {
      this.setState({ loadingState: states.ERROR });
    }
  }
}
