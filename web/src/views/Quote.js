import React from "react";
import { QuoteBackground } from "../components/elements";
import Quote from "../components/Quote";
import QuoteList from "../components/QuoteList";
import * as Fetchers from "../fetchers";

export default function QuoteView({ match: { params } }) {
  return (
    <React.Fragment>
      <QuoteBackground>
        <Fetchers.Quote quoteID={params.quoteID}>
          {(quote, loadState) => <Quote quote={quote} loadState={loadState} />}
        </Fetchers.Quote>
      </QuoteBackground>

      <Fetchers.Quotes>
        {(quotes, loadState) => (
          <QuoteList quotes={quotes} loadState={loadState} />
        )}
      </Fetchers.Quotes>
    </React.Fragment>
  );
}
