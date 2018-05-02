import React from "react";
import Quote from "../components/Quote";
import QuoteList from "../components/QuoteList";
import { QuoteBackground } from "../components/elements";

export default ({ match: { params } }) => (
  <React.Fragment>
    <QuoteBackground>
      <Quote quoteID={params.quoteID} />
    </QuoteBackground>

    <QuoteList />
  </React.Fragment>
);
