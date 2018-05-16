import React from "react";
import { withRouter } from "react-router-dom";
import "./TextLogo.css";

export default withRouter(({ history }) => (
  <div onClick={() => history.push("/")} className="serif TextLogo">
    <h1>
      <span className="TextLogo__top">200</span>
      <br />
      <span className="TextLogo__bottom">WOMEN</span>
    </h1>
  </div>
));
