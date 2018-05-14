import React from "react";
import styled from "styled-components";
import "./QuoteFontSizes.css";

const NameSpan = styled.span`
  opacity: ${({ isBlank }) => (isBlank ? "0.5" : "1")};
`;

export default function QuotePreviewWrapper({ children, name = "" }) {
  return (
    <div className="quote__container requiem">
      <div
        className="quote__bg-image abs"
        style={{
          backgroundImage: "url(backgrounds/engagement-tile-1.jpg)"
        }}
      />

      <div className="abs quote__wrapper">
        <div className="quote">
          <div className="row">What matters to me?</div>
          {children}
          <div className="row">
            <NameSpan isBlank={name == null || name === ""}>
              {name === "" ? "Enter a name below" : name}
            </NameSpan>
            <div>200 Women</div>
          </div>
        </div>
      </div>
    </div>
  );
}
