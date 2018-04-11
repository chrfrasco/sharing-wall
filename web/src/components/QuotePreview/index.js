//@ts-check
import React from "react";
import styled from "styled-components";

const QuoteWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: #DDD;
  font-family: Requiem;
`;

const QuoteInputWrapper = styled.div`
  position: relative;
  background-color: #fff9ed;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  max-width: 600px;
  margin: 0 auto;

  h3 {
    margin: 0;
    font-weight: normal;
  }

  textarea {
    background-color: transparent;
    border: none;
    resize: none;

    font-size: 3rem;

    &:focus {
      outline: none;
    }
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const QuoteInput = ({ quote, handleQuoteChange }) =>
  <QuoteInputWrapper>
    <h3>What matters to me?</h3>
    <textarea placeholder={'Type here'} value={quote} onChange={handleQuoteChange} />
    <Row>
      <span>Elizabeth Blackwell</span>
      <span>200 Women</span>
    </Row>
  </QuoteInputWrapper>

export default ({ quote, handleQuoteChange }) =>
  <QuoteWrapper>
    <QuoteInput quote={quote} handleQuoteChange={handleQuoteChange} />
  </QuoteWrapper>;