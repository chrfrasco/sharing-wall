import React from "react";
import styled from "styled-components";
import Quote from "./Quote";
import * as Icons from "./icons";
import { makeFacebookShareURL, makeTwitterShareURL } from "../utils";

const IconWrapper = styled.div`
  position: absolute;
  bottom: -1px;
  left: 50%;

  display: flex;
  justify-content: space-between;
  padding: 0.4rem;

  height: 2rem;
  width: 6rem;

  background-color: white;

  transform: translateX(-50%);
`;

function IconLinkWrapper({ quote, children }) {
  children = React.Children.map(children, child => {
    const props = {};
    if (child.type === Icons.Facebook) {
      props.href = makeFacebookShareURL(quote.quoteID);
    } else if (child.type === Icons.Twitter) {
      props.href = makeTwitterShareURL(quote.quoteID);
    } else {
      props.href = quote.img;
      props.download = `${quote.quoteID}.png`;
    }

    return (
      <a {...props} style={{ color: "unset" }}>
        {child}
      </a>
    );
  });

  return <IconWrapper>{children}</IconWrapper>;
}

function ShareLinks({ quote }) {
  return (
    <IconLinkWrapper quote={quote}>
      <Icons.Facebook />
      <Icons.Instagram />
      <Icons.Twitter />
    </IconLinkWrapper>
  );
}

export default ({ quote, showShare = false, tight = false, ...rest }) => (
  <div className="quote__container">
    <Quote quote={quote} {...rest} />
    {showShare && quote != null && <ShareLinks quote={quote} />}
  </div>
);
