import React from "react";
import { Link } from "react-router-dom";
import TextLogo from "./TextLogo";
import "./Header.css";

export default () => (
  <header className="header">
    <div className="header__top_row">
      <div />
      <Link to="/quotes">Visit the wall</Link>
    </div>
    <div className="header__bottom_row">
      <TextLogo />
    </div>
  </header>
);
