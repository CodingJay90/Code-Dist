import AppContainer from "@/components/App/AppContainer/Index";
import AppNavbar from "@/components/AppNavbar/Index";
import { Fragment } from "react";
import InteractionContextProvider from "@/contexts/interactions/InteractionContextProvider";
import MenuBar from "@/components/App/MenuBar/Index";

const App = () => {
  return (
    <Fragment>
      <InteractionContextProvider>
        <MenuBar />
        <AppNavbar />
        <AppContainer />
      </InteractionContextProvider>
    </Fragment>
  );
};

export default App;
