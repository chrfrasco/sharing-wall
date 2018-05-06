import React from "react";
import QuoteList from "../components/QuoteList";
import QuoteWithBackground from "../components/QuoteWithBackground";
import * as Fetchers from "../fetchers";

export default function QuoteView({ match: { params } }) {
  return (
    <React.Fragment>
      <Fetchers.Quote quoteID={params.quoteID}>
        {(quote, loadState) => (
          <QuoteWithBackground quote={quote} loadState={loadState} showShare />
        )}
      </Fetchers.Quote>

      <Fetchers.Quotes>
        {(quotes, loadState) => (
          <QuoteList quotes={quotes} loadState={loadState} />
        )}
      </Fetchers.Quotes>
    </React.Fragment>
  );
}
