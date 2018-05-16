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
    font-size: 14px;
    font-style: normal;
    font-weight: 300;

    @media (max-width: 900px) {
      font-size: 16px;
    }
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
