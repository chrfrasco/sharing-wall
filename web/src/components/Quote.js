import React from "react";
import { Redirect } from "react-router";
import { states, NotFoundError } from "../api";
import { FixedAspectRatio } from "./elements";

export default function QuoteLoader({ quote, loadingState }) {
  switch (loadingState) {
    case states.LOADING:
      return <LoadingView />;
    case states.NOT_FOUND:
      return <NotFoundView />;
    case states.ERROR:
      return <ErrorView />;
    default:
      return <QuoteView quote={quote} />;
  }
}

export function LoadingView() {
  return <FixedAspectRatio w={1} h={1} />;
}

export function NotFoundView() {
  return <h1>Couldn't find that quote</h1>;
}

export function ErrorView() {
  return <Redirect to="/error" />;
}

export function QuoteView({ quote }) {
  const src = `https://s3-ap-southeast-2.amazonaws.com/sharing-wall/${
    quote.quoteID
  }.png`;
  return (
    <FixedAspectRatio w={1} h={1}>
      <img
        style={{ maxWidth: "100%", display: "block" }}
        src={src}
        alt={`Quote by ${quote.name}`}
      />
    </FixedAspectRatio>
  );
}
