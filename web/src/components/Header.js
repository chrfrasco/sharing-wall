import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  width: 100%;
  max-width: 880px;
  position: fixed;
  top: 0;
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 599px) {
    left: 0;
    padding: 0 14px;
    width: 100%;
  }

  @media (min-width: 600px) and (max-width: 899px) {
    left: 0;
    padding: 0 51px;
  }

  @media (min-width: 900px) {
    padding: 0 39px;
  }
`;

export default () => (
  <Nav>
    <Link to="/">Go Home</Link>
    <Link to="/quotes">Quotes</Link>
  </Nav>
);
