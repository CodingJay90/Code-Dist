import React from "react";
import OpenedEditorsPanel from "@/components/App/Editor/OpenedEditorsPanel/Index";
import EditorView from "@/components/App/Editor/EditorView/Index";
import { StyledContainer } from "@/elements/Global";
import { Container } from "./elements";
import { useAppSelector } from "@/reduxStore/hooks";
import NoFilesOpened from "./NoFilesOpened";

const Editor = () => {
  const { activeOpenedFile, directoryTree, openedFiles } = useAppSelector(
    (state) => state.app
  );
  return (
    <Container>
      {!openedFiles.length ? (
        <NoFilesOpened />
      ) : (
        <>
          <OpenedEditorsPanel />
          <EditorView />
        </>
      )}
    </Container>
  );
};

export default Editor;
