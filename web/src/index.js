import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css.js";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { IS_PRODUCTION } from "./constants/";

if (!IS_PRODUCTION) {
  localStorage.clear();
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
