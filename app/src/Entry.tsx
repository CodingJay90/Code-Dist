import Routes from "./Routes";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/theme";
import GlobalStyle from "./styles/globalstyles";
import ApolloClientWrapper from "./ApolloClientWrapper";
import { Provider } from "react-redux";
import { store } from "@/reduxStore/store";
import { Helmet } from "react-helmet";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const Entry = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Code Dist</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=K2D:300,400,500,700,800"
        />
      </Helmet>
      <Provider store={store}>
        <ApolloClientWrapper>
          <ThemeProvider theme={defaultTheme}>
            <DndProvider backend={HTML5Backend}>
              <GlobalStyle />
              <Routes />
            </DndProvider>
          </ThemeProvider>
        </ApolloClientWrapper>
      </Provider>
    </>
  );
};

export default Entry;
