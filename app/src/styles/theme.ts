import { DefaultTheme } from "styled-components";
export const defaultTheme: DefaultTheme = {
  borderRadius: "4px",
  spacing: (spacing: number = 16) => `${spacing}px`,
  colors: {
    main: "black",
    secondary: "blue",
  },
};
