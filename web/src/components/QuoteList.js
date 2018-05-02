import React from "react";
import { QuoteView as Quote } from "./Quote";
import { states } from "../api";
import { Grid, GridItem, Spinner, QuoteBackground } from "./elements";
import Modal from "./Modal";

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

function QuoteListItem({ quote }) {
  return (
    <Modal>
      <Modal.Toggle>
        {openModal => (
          <GridItem onClick={openModal}>
            <Quote quote={quote} />
          </GridItem>
        )}
      </Modal.Toggle>

      <Modal.Body>
        {() => (
          <QuoteBackground>
            <Quote quote={quote} />
          </QuoteBackground>
        )}
      </Modal.Body>
    </Modal>
  );
}

export function QuoteListView({ quotes }) {
  return (
    <Grid>
      {quotes.map(quote => <QuoteListItem key={quote.quoteID} quote={quote} />)}
    </Grid>
  );
}
