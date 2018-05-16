import React from "react";
import { Redirect } from "react-router";
import { states } from "../api";
import { FixedAspectRatio } from "./elements";
import LazyImage from "./LazyImage";

export default function Quote({ quote, loadState, ...rest }) {
  switch (loadState) {
    case states.LOADING:
      return <LoadingView />;
    case states.NOT_FOUND:
      return <NotFoundView />;
    case states.ERROR:
      return <ErrorView />;
    default:
      return <QuoteView quote={quote} {...rest} />;
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

export function QuoteView({ quote, ...rest }) {
  const src = `https://s3-ap-southeast-2.amazonaws.com/sharing-wall/${
    quote.quoteID
  }.png`;

  const { className, square, ...props } = rest;
  const styleName = [className, "abs", square && "abs--square"]
    .filter(Boolean)
    .join(" ");

  return (
    <LazyImage
      src={src}
      alt={`Quote by ${quote.name}`}
      className={styleName}
      {...props}
    />
  );
}
