import React from "react";
import { retrieveQuote } from "../utils";
import { states } from "../api";
import { FixedAspectRatio } from "./elements";

export default class Quote extends React.Component {
  state = { loadingState: states.LOADING };

  componentDidMount() {
    this.doFetch();
  }

  render() {
    switch (this.state.loadingState) {
      case states.LOADING:
        return <FixedAspectRatio w={1} h={1} />;
      case states.LOADED:
        return Quote.renderQuote(this.state.quote);
      case states.NOT_FOUND:
        return <h1>Could not find quote</h1>;
      case states.ERROR:
        return <h1>Oops, something went wrong.</h1>;
      default:
        throw new Error(`loadingState ${this.state.loadingState} not valid`);
    }
  }

  static renderQuote(quote) {
    const src = `https://s3-ap-southeast-2.amazonaws.com/sharing-wall/${
      quote.quoteID
    }.png`;
    return (
      <FixedAspectRatio w={1} h={1}>
        <img
          style={{ maxWidth: "100%", display: "block" }}
          src={src}
          alt={`Quote by ${quote.name}`}
        />
      </FixedAspectRatio>
    );
  }

  async doFetch() {
    const { quoteID } = this.props;
    try {
      const quote = await retrieveQuote(quoteID);
      this.setState({ quote, loadingState: states.LOADED });
    } catch (e) {
      this.setState({ loadingState: states.ERROR });
    }
  }
}
