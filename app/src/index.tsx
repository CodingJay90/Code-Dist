import ReactDOM from "react-dom";
import Entry from "./Entry";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Entry />);
