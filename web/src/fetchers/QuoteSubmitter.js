import React from "react";
import { Redirect } from "react-router";
import api, { states } from "../api";

export default class QuoteSubmitter extends React.Component {
  state = { loadingState: states.NOT_STARTED };

  render() {
    switch (this.state.loadingState) {
      case states.NOT_STARTED:
        return this.props.children({
          isSubmitting: false,
          submitQuote: this.submitQuote
        });

      case states.LOADING:
        return this.props.children({
          isSubmitting: true,
          submitQuote: this.submitQuote
        });

      case states.LOADED:
        return <Redirect to={`/quote/${this.state.quoteID}`} />;

      case states.ERROR:
        return <Redirect to="/error" />;

      default:
        throw new TypeError(
          `loadingState ${this.props.loadingState.toString()} not handled`
        );
    }
  }

  submitQuote = quote => {
    this.setState({ loadingState: states.LOADING });

    api
      .postQuote(quote)
      .then(this.handleSubmitSuccess)
      .catch(this.handleSubmitFailure);
  };

  handleSubmitSuccess = updatedQuote =>
    this.setState({
      loadingState: states.LOADED,
      quoteID: updatedQuote.quoteID
    });

  handleSubmitFailure = () => this.setState({ loadingState: states.ERROR });
}
