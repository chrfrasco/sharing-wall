import React from "react";
import api, { states } from "../api";

export default class QuoteListFetcher extends React.Component {
  state = { loadState: states.LOADING };

  constructor(props) {
    super(props);
    this.doFetchQuotes = this.doFetchQuotes.bind(this);
  }

  componentDidMount() {
    this.doFetchQuotes();
  }

  render() {
    return this.props.children(this.state.quotes, this.state.loadState);
  }

  async doFetchQuotes() {
    try {
      const quotes = await api.getQuotes();
      this.setState({ quotes, loadState: states.LOADED });
    } catch (e) {
      this.setState({ loadState: states.ERROR });
    }
  }
}
