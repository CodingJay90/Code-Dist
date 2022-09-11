import React from "react";
import OpenedEditorsPanel from "@/components/App/Editor/OpenedEditorsPanel/Index";
import EditorView from "@/components/App/Editor/EditorView/Index";
import { StyledContainer } from "@/elements/Global";
import { Container } from "./elements";

const Editor = () => {
  return (
    <Container>
      <OpenedEditorsPanel />
      <EditorView />
    </Container>
  );
};

export default Editor;
