import { injectGlobal } from "styled-components";

injectGlobal`
  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }

  html {
    box-sizing: border-box;
    width: 100%;

    color: #333333;
    -webkit-font-smoothing: antialiased;
    font-family: "Whitney SSm A", "Whitney SSm B";
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
  }

  input,
  textarea {
    font-family: inherit;
    color: inherit;

    resize: none;

    &::placeholder {
      opacity: 0.4;
    }
  }
`;
