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
    color: #1F1F1F;
  }
  ::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.1);
  }
  ::-webkit-scrollbar-thumb {
    background: #999;
    /* background-image: linear-gradient(45deg, #00aeff, #a68eff); */
    border-radius: 10px;
    -webkit-box-shadow: rgba(0, 0, 0, 0.12) 0 3px 13px 1px;
  }
`;

export default GlobalStyle;
