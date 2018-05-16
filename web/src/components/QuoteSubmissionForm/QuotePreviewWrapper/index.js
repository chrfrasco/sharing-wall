import React from "react";
import styled from "styled-components";
import "./QuoteFontSizes.css";

const NameSpan = styled.span`
  opacity: ${({ isBlank }) => (isBlank ? "0.5" : "1")};
`;

export default function QuotePreviewWrapper({
  children,
  bgVersion,
  name = ""
}) {
  return (
    <div className="quote__container quote__container--preview requiem">
      <div
        className="quote__bg-image abs abs-shrink"
        style={{
          backgroundImage: `url(backgrounds/engagement-tile-${bgVersion}.jpg)`
        }}
      />

      <div className="abs abs-shrink quote__wrapper">
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
