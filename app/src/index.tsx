import Entry from "./Entry";
import { createRoot } from "react-dom/client";

function preventDefaultPageSave(): void {
  document.addEventListener(
    "keydown",
    (e) => {
      if (
        e.key === "s" &&
        (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
      }
    },
    false
  );
}

preventDefaultPageSave();
const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Entry />);
