import AppContainer from "@/components/App/AppContainer/Index";
import AppNavbar from "@/components/AppNavbar/Index";
import { Fragment } from "react";
import InteractionContextProvider from "@/contexts/interactions/InteractionContextProvider";

const App = () => {
  return (
    <Fragment>
      <InteractionContextProvider>
        <AppNavbar />
        <AppContainer />
      </InteractionContextProvider>
    </Fragment>
  );
};

export default App;
