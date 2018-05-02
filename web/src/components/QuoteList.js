import React from "react";
import { QuoteView as Quote } from "./Quote";
import { states } from "../api";
import { Grid, GridItem, Spinner } from "./elements";

export default function QuoteList({ quotes, loadState }) {
  switch (loadState) {
    case states.LOADING:
      return <Spinner />;
    case states.ERROR:
      return "error";
    default:
      return <QuoteListView quotes={quotes} />;
  }
}

export function QuoteListView({ quotes }) {
  return (
    <Grid>
      {quotes.map(quote => (
        <GridItem key={quote.quoteID}>
          <Quote quote={quote} />
        </GridItem>
      ))}
    </Grid>
  );
}
