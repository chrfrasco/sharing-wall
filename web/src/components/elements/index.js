import React from "react";
import styled, { keyframes } from "styled-components";
import { clamp } from "../../utils";

export function Heading({
  level = 1,
  center = false,
  style = {},
  children,
  ...rest
}) {
  style.fontWeight = "inherit";
  if (center) {
    style.textAlign = "center";
  }

  const clampedLevel = clamp(level, { min: 1, max: 6 });
  return React.createElement(`h${clampedLevel}`, { style, ...rest }, children);
}

export const QuoteBackground = styled.div`
  background-color: #f9f8f7;
  font-family: "Requiem Display A", "Requiem Display B";
  font-style: normal;
  font-weight: 400;
  overflow: hidden;

  @media (min-width: 532px) {
    padding: 1rem;
  }

  & > div:first-child,
  & > img:first-child {
    margin: 0 auto;
    max-width: 500px;
    display: block;
    box-shadow: 1px 1px 25px rgba(0, 0, 0, 0.05);
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: ${props => props.align || "initial"};
  height: 100%;

  p {
    margin: 0;
  }

  small {
    font-size: 0.7em;
  }

  @media (max-width: 750px) {
    flex-wrap: wrap;
    justify-content: space-between;

    section {
      margin-bottom: 1em;
    }
  }
`;

export const SubmitButton = styled.input`
  font-size: 0.9em;

  width: 5rem;
  height: 5rem;

  border: none;
  border-radius: 100%;

  background-color: #444;
  color: white;

  opacity: 1;
  transition: opacity 125ms ease-in-out;

  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  margin: 0 auto;
  height: 32px;
  width: 32px;

  border: medium solid rgba(0, 0, 0, 0);
  border-top: medium solid ${props => props.color};
  border-left: medium solid ${props => props.color};
  border-radius: 100%;

  animation: ${rotate360} 1s ease;
  animation-iteration-count: infinite;
`;

export const LoadingSubmitButton = ({ disabled }) => {
  const SubmitButton = styled.div`
    font-size: 0.9em;

    width: 5rem;
    height: 5rem;

    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 100%;

    background-color: #444;
    color: white;

    opacity: 0.4;
  `;

  return (
    <SubmitButton>
      <Spinner color="currentColor" />
    </SubmitButton>
  );
};

export const FormField = styled.div`
  font-size: 1rem;
  margin: 0 1em 0.4em 1em;

  @media (min-width: 750px) {
    width: 20em;
  }

  @media (max-width: 750px) {
    margin: 0 0 0.4em 0;
    width: 100%;
  }

  label {
    font-size: 0.8rem;
    margin-left: 0.1rem;
    display: inline-block;
    min-width: 6em;
  }

  input,
  textarea {
    font-size: inherit;
    font-weight: inherit;

    padding-left: 0.1rem;
    padding-right: 0.1rem;
    border: none;

    background-color: rgb(248, 248, 248);
    min-width: 14em;
  }

  textarea {
    margin-top: 1rem;
    display: block;
    width: 100%;
  }
`;

export const Spacer = styled.div`
  height: ${props => props.height || 1}rem;
`;

export function FixedAspectRatio({ children = null, w = 1, h = 1 }) {
  const Fixed = styled.div`
    position: relative;
    width: 100%;

    &::before {
      content: "";
      display: block;
      padding-top: ${({ w, h }) => h / w * 100}%;
    }
  `;

  const Inner = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  `;

  return (
    <Fixed w={w} h={h}>
      <Inner>{children}</Inner>
    </Fixed>
  );
}

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Grid = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const GridItem = styled.div`
  position: relative;

  @media (max-width: 599px) {
    width: 100%;
  }

  @media (min-width: 600px) and (max-width: 899px) {
    width: calc(33.33%);
  }

  @media (min-width: 900px) {
    width: calc(25%);
  }
`;
