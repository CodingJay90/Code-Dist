import React from "react";
import OpenedEditorsPanel from "@/components/App/Editor/OpenedEditorsPanel/Index";
import EditorView from "@/components/App/Editor/EditorView/Index";
import { StyledContainer } from "@/elements/Global";

const Editor = () => {
  return (
    <StyledContainer width="100%">
      <OpenedEditorsPanel />
      <EditorView />
    </StyledContainer>
  );
};

export default Editor;
