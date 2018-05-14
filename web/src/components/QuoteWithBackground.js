import React from "react";
import styled from "styled-components";
import { QuoteBackground } from "./elements";
import Quote from "./Quote";
import * as Icons from "./icons";

const DaShareZoneWrapper = styled.div`
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

function DaShareZone() {
  return (
    <DaShareZoneWrapper>
      <Icons.Facebook />
      <Icons.Instagram />
      <Icons.Twitter />
    </DaShareZoneWrapper>
  );
}

export default ({ quote, showShare = false, tight = false, ...rest }) => (
  <div className="quote__container">
    <Quote quote={quote} {...rest} />
    {showShare && <DaShareZone />}
  </div>
);
