import React from "react";
import { retrieveQuote } from "../utils";
import { states, NotFoundError } from "../api";

export default class QuoteFetcher extends React.Component {
  state = { loadingState: states.LOADING };

  componentDidMount() {
    this.doFetch();
  }

  render() {
    return this.props.children(this.state.quote, this.state.loadingState);
  }

  async doFetch() {
    try {
      const quote = await retrieveQuote(this.props.quoteID);
      this.setState({ quote, loadingState: states.LOADED });
    } catch (e) {
      this.handleFetchError(e);
    }
  }

  handleFetchError(e) {
    if (e instanceof NotFoundError) {
      this.setState({ loadingState: states.NOT_FOUND });
      return;
    }

    this.setState({ loadingState: states.ERROR });
  }
}
