import React from "react";
import styled from "styled-components";
import { FixedAspectRatio, Row } from "../../elements";
import { IS_DEVICE_TOUCHSCREEN } from "../../../constants";
import "./QuoteFontSizes.css";

const Background = styled.div`
  background-color: #dedede;
  padding: 1rem;
  font-family: Requiem;

  & > div:first-child {
    margin: 0 auto;
    max-width: 500px;
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: white;
  padding: 1rem;

  textarea {
    height: 100%;
    width: 100%;
    overflow: hidden;

    display: block;

    resize: none;

    border: none;

    background-color: transparent;

    &:focus {
      outline: none;
    }
  }
`;

const NameSpan = styled.span`
  opacity: ${({ isBlank }) => (isBlank ? "0.5" : "1")};
`;

export default class QuotePreviewWrapper extends React.Component {
  previousQuote = this.props.quote;

  constructor(props) {
    super(props);
    this.textArea = React.createRef();
  }

  componentDidUpdate() {
    const shouldFocus =
      !IS_DEVICE_TOUCHSCREEN && this.previousQuote !== this.props.quote;
    this.previousQuote = this.props.quote;

    if (shouldFocus) {
      this.textArea.current.focus();
    }
  }

  componentDidMount() {
    this.textArea.current.focus();
  }

  render() {
    const {
      name,
      handleQuoteChange,
      quote,
      styleName,
      placeholder
    } = this.props;

    return (
      <Background>
        <FixedAspectRatio w={1} h={1}>
          <Inner>
            <span>What matters to me?</span>

            <div style={{ flex: 1 }}>
              <textarea
                ref={this.textArea}
                value={quote}
                onChange={handleQuoteChange}
                className={styleName}
                placeholder={placeholder}
                readOnly={IS_DEVICE_TOUCHSCREEN}
                maxLength={280}
              />
            </div>

            <Row>
              <NameSpan isBlank={name === ""}>
                {name === "" ? "Enter your name below" : name}
              </NameSpan>
              <span>Two Hundred Women</span>
            </Row>
          </Inner>
        </FixedAspectRatio>
      </Background>
    );
  }
}
