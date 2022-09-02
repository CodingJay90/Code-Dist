import { BrowserRouter, Routes as AppRoutes, Route } from "react-router-dom";
import App from "./pages/App";
import Home from "./pages/Home";

const Routes = () => {
  return (
    <BrowserRouter>
      <AppRoutes>
        <Route path="/" element={<Home />} />
        <Route path="app" element={<App />} />
      </AppRoutes>
    </BrowserRouter>
  );
};

export default Routes;
