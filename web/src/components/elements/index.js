import React from "react";
import styled from "styled-components";

export const FormField = styled.div`
  font-size: 1rem;
  margin-bottom: 0.4rem;

  label {
    font-size: 0.8rem;
    margin-left: 0.1rem;
  }

  input,
  textarea {
    font-size: inherit;
    padding-left: 0.1rem;
    padding-right: 0.1rem;
    border: none;

    background-color: rgb(248, 248, 248);
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

export function FixedAspectRatio({ children, w = 1, h = 1 }) {
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
