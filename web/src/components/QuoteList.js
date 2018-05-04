import React from "react";
import styled from "styled-components";
import { QuoteView as Quote } from "./Quote";
import { states } from "../api";
import { Grid, GridItem, Spinner, QuoteBackground, Heading } from "./elements";
import Modal from "./Modal";
import close from "./close.svg";

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
          <GridItem style={{ cursor: "pointer" }} onClick={openModal}>
            <QuoteBackground>
            <Quote quote={quote} />
            </QuoteBackground>
          </GridItem>
        )}
      </Modal.Toggle>

      <Modal.Body>
        {({ closeModal }) => (
          <QuotePopup quote={quote} closeModal={closeModal} />
        )}
      </Modal.Body>
    </Modal>
  );
}

function QuotePopup({ closeModal, quote }) {
  return (
    <React.Fragment>
      <CloseButton onClick={closeModal} />
          <QuoteBackground>
            <Quote quote={quote} />
          </QuoteBackground>
    </React.Fragment>
  );
}

const CloseButtonImg = styled.img`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  height: 1.8rem;
  width: 1.8rem;
  z-index: 2;
  cursor: pointer;

  opacity: 1;
  transition: opacity 125ms ease-in-out;

  &:hover {
    opacity: 0.4;
  }
`;

function CloseButton({ onClick }) {
  return (
    <CloseButtonImg src={close} onClick={onClick} alt="close" role="button" />
  );
}

export function QuoteListView({ quotes }) {
  return (
    <Grid>
      {quotes.map(quote => <QuoteListItem key={quote.quoteID} quote={quote} />)}
    </Grid>
  );
}
