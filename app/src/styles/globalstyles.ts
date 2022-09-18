import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: K2D, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-family: Open-Sans, Helvetica, Sans-Serif;
    overflow: hidden;
  }
  * {
    margin:0;
    padding:0;
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
