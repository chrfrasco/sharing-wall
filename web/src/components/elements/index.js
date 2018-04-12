import React from "react";
import styled from "styled-components";

export function FixedAspectRatio({ children, w = 1, h = 1 }) {
  const Fixed = styled.div`
    position: relative;
    width: 100%;

    &::before {
      content: "";
      display: block;
      padding-top: ${({ w, h }) => (h / w) * 100}%;
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
      <Inner>
        {children}
      </Inner>
    </Fixed>
  );
}

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;