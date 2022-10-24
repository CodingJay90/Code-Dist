import { DefaultTheme } from "styled-components";

const colors = {
  mainDark: "#DDDDDB;",
  mainMd: "#F5F5F5",
  mainLight: "#EFEFEF",
  blackLight: "#6a6a6a",
  blackDark: "#000",
  blackMd: "#1e1c1cd6;", //"#3d3d3d",
  white: "#fff;",
  whiteDark: "#f1f1f1;",
  whiteMd: "#fefefe;",
};

export const defaultTheme: DefaultTheme = {
  borderRadius: "4px",
  spacing: (spacing: number = 16) => `${spacing}px`,
  colors,
};
