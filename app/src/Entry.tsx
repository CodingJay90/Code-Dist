import Routes from "./Routes";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/theme";
import GlobalStyle from "./styles/globalstyles";
import ApolloClientWrapper from "./ApolloClientWrapper";

const Entry = () => {
  return (
    <>
      <ApolloClientWrapper>
        <ThemeProvider theme={defaultTheme}>
          <GlobalStyle />
          <Routes />
        </ThemeProvider>
      </ApolloClientWrapper>
    </>
  );
};

export default Entry;
