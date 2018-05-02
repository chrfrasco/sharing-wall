import React from "react";
import { QuoteView as Quote } from "./Quote";
import api, { states } from "../api";
import styled from "styled-components";

const Grid = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 599px) {
    padding: 0 14px;
  }

  @media (min-width: 600px) and (max-width: 899px) {
    padding: 0 51px;
  }

  @media (min-width: 900px) {
    padding: 0 39px;
  }
`;

const GridItem = styled.div`
  position: relative;

  @media (max-width: 599px) {
    width: 100%;
    margin-bottom: 14px;
  }

  @media (min-width: 600px) and (max-width: 899px) {
    width: calc(33.33% - 23px);
    margin-top: 34px;
  }

  @media (min-width: 900px) {
    width: calc(25% - 20px);
    margin-top: 26px;
  }
`;

export default class QuoteList extends React.Component {
  state = { loadingState: states.LOADING };

  constructor(props) {
    super(props);
    this.doFetchQuotes = this.doFetchQuotes.bind(this);
  }

  componentDidMount() {
    this.doFetchQuotes();
  }

  render() {
    switch (this.state.loadingState) {
      case states.LOADING:
        return "loading...";
      case states.LOADED:
        return (
          <Grid>
            {this.state.quotes.map(quote => (
              <GridItem key={quote.quoteID}>
                <Quote quote={quote} />
              </GridItem>
            ))}
          </Grid>
        );
      case states.ERROR:
        return "error";
      default:
        throw new TypeError(
          `unhandled loadingState "${this.state.loadingState}"`
        );
    }
  }

  async doFetchQuotes() {
    try {
      const quotes = await api.getQuotes();
      this.setState({ quotes, loadingState: states.LOADED });
    } catch (e) {
      this.setState({ loadingState: states.ERROR });
    }
  }
}
