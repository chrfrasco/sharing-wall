import React from "react";
import QuoteList from "../components/QuoteList";
import * as Fetchers from "../fetchers";

export default () => (
  <Fetchers.Quotes>
    {(quotes, loadState) => <QuoteList quotes={quotes} loadState={loadState} />}
  </Fetchers.Quotes>
);
