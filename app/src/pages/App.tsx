import AppContainer from "@/components/App/AppContainer/Index";
import AppNavbar from "@/components/AppNavbar/Index";
import { Fragment } from "react";

const App = () => {
  return (
    <Fragment>
      <AppNavbar />
      <AppContainer />
    </Fragment>
  );
};

export default App;
