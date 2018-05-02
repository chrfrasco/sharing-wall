import React from "react";
import QuoteLoader from "../components/Quote";
import QuoteList from "../components/QuoteList";
import { QuoteBackground } from "../components/elements";
import QuoteFetcher from "../containers/QuoteFetcher";

export default ({ match: { params } }) => (
  <React.Fragment>
    <QuoteBackground>
      <QuoteFetcher quoteID={params.quoteID}>
        {(quote, loadingState) => (
          <QuoteLoader quote={quote} loadingState={loadingState} />
        )}
      </QuoteFetcher>
    </QuoteBackground>

    <QuoteList />
  </React.Fragment>
);
