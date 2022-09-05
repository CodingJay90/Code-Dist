import React, { useEffect } from "react";
import { Container } from "./elements";
import { editor } from "monaco-editor";

const EditorView = () => {
  useEffect(() => {
    editor.create(document.getElementById("editor")!, {
      value: "function hello() {\n\talert('Hello world!');\n}",
      language: "javascript",
    });
  }, []);
  return <Container id="editor"></Container>;
};

export default EditorView;
