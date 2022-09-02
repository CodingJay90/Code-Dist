import Routes from "./Routes";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/theme";
import GlobalStyle from "./styles/globalstyles";

const Entry = () => {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyle />
        <Routes />
      </ThemeProvider>
    </>
  );
};

export default Entry;
