import Routes from "./Routes";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/theme";
import GlobalStyle from "./styles/globalstyles";
import ApolloClientWrapper from "./ApolloClientWrapper";
import { Provider } from "react-redux";
import { store } from "@/reduxStore/store";

const Entry = () => {
  return (
    <>
      <Provider store={store}>
        <ApolloClientWrapper>
          <ThemeProvider theme={defaultTheme}>
            <GlobalStyle />
            <Routes />
          </ThemeProvider>
        </ApolloClientWrapper>
      </Provider>
    </>
  );
};

export default Entry;
