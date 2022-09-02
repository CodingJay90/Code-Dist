import "styled-components";

type ThemeSpacing = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128;
// type ThemeSpacing = 1 | 2 | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | 64 | 128;
declare module "styled-components" {
  export interface DefaultTheme {
    borderRadius: string;
    spacing: (space: ThemeSpacing) => string;
    colors: {
      main: string;
      secondary: string;
    };
  }
}
