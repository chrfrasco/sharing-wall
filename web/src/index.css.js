import { injectGlobal } from "styled-components";

injectGlobal`
  *, *:after, *:before {
    box-sizing: inherit;
  }

  html {
    box-sizing: border-box;
    width: 100%;

    color: #333333;
    -webkit-font-smoothing: antialiased;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }

  input,
  textarea {
    font-family: inherit;
    color: inherit;

    &::placeholder {
      opacity: 0.4;
    }
  }
`;
